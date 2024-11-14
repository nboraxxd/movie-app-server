import ms from 'ms'
import z from 'zod'
import omit from 'lodash/omit'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { JsonWebTokenError, decode } from 'jsonwebtoken'
import { ParamsDictionary } from 'express-serve-static-core'

import User, { UserDocumentWithoutPassword } from '@/models/user.model'
import { EntityError, ErrorWithStatus, ErrorWithStatusAndLocation } from '@/models/errors'
import RefreshToken from '@/models/refresh-token.model'
import { TokenPayload } from '@/types/token.type'
import { TokenType } from '@/constants/type'
import { EMAIL_TEMPLATES } from '@/constants/email-templates'
import { HttpStatusCode } from '@/constants/http-status-code'
import { sendEmail } from '@/utils/mailgun'
import { hashPassword } from '@/utils/crypto'
import { capitalizeFirstLetter } from '@/utils/common'
import { verifyRefreshToken, verifyResetPasswordToken, signToken } from '@/utils/jwt'
import databaseService from '@/services/database.services'
import profileService from '@/services/profile.services'
import { ForgotPasswordBodyType, RegisterBodyType, ResetPasswordBodyType } from '@/schemas/auth.schema'
import envVariables from '@/schemas/env-variables.schema'
import { ChangePasswordBodyType, EmailVerifyTokenType, LoginBodyType, RefreshTokenType } from '@/schemas/auth.schema'

class AuthService {
  async signAccessToken(userId: string) {
    return signToken({
      payload: { userId, tokenType: TokenType.AccessToken },
      privateKey: envVariables.JWT_SECRET_ACCESS_TOKEN,
      options: {
        expiresIn: envVariables.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    })
  }

  async signRefreshToken(userId: string, exp?: number) {
    return signToken({
      payload: omitBy(
        {
          userId,
          tokenType: TokenType.RefreshToken,
          exp,
        },
        isUndefined
      ) as Pick<TokenPayload, 'userId' | 'tokenType'> & { exp?: number },
      privateKey: envVariables.JWT_SECRET_REFRESH_TOKEN,
      options: exp ? undefined : { expiresIn: envVariables.JWT_REFRESH_TOKEN_EXPIRES_IN },
    })
  }

  private async signAccessTokenAndRefreshToken(userId: string) {
    return Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
  }

  async signEmailVerifyToken(userId: string) {
    return signToken({
      payload: { userId, tokenType: TokenType.EmailVerifyToken },
      privateKey: envVariables.JWT_SECRET_EMAIL_VERIFY_TOKEN,
      options: {
        expiresIn: envVariables.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN,
      },
    })
  }

  async sendVerificationEmail(payload: { email: string; name: string; token: string; clientUrl: string }) {
    const { email, name, token, clientUrl } = payload

    return sendEmail({
      name,
      email,
      subject: '[nmovies] Verify your email',
      html: EMAIL_TEMPLATES.EMAIL_VERIFICATION({
        name,
        link: `${clientUrl}/verify-email?token=${token}`,
      }),
    })
  }

  async validateUserRegister(req: Request<ParamsDictionary, any, RegisterBodyType>) {
    const user = await profileService.findByEmail(req.body.email)

    if (user) {
      throw new EntityError({
        message: 'Validation error occurred in body',
        errors: [
          {
            code: z.ZodIssueCode.custom,
            message: 'Email already exists',
            location: 'body',
            path: 'email',
          },
        ],
      })
    }
  }

  async register(payload: Omit<RegisterBodyType, 'confirmPassword' | 'clientUrl'>) {
    const { email, name, password } = payload

    const userId = new ObjectId()

    const [emailVerifyToken, accessToken, refreshToken] = await Promise.all([
      this.signEmailVerifyToken(userId.toHexString()),
      this.signAccessToken(userId.toHexString()),
      this.signRefreshToken(userId.toHexString()),
    ])

    const { iat, exp } = await verifyRefreshToken(refreshToken)

    await Promise.all([
      databaseService.users.insertOne(
        new User({ _id: userId, email, name, password: hashPassword(password), emailVerifyToken })
      ),
      databaseService.refreshTokens.insertOne(new RefreshToken({ userId, token: refreshToken, iat, exp })),
    ])

    return { accessToken, refreshToken, emailVerifyToken }
  }

  async validateResendEmailVerificationReq(req: Request<ParamsDictionary, any, EmailVerifyTokenType>) {
    const { userId } = req.decodedAuthorization as TokenPayload

    const user = await profileService.findById(userId)

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        statusCode: HttpStatusCode.NotFound,
      })
    }

    if (user.emailVerifyToken === null) {
      throw new ErrorWithStatus({
        message: 'Account has been verified',
        statusCode: HttpStatusCode.BadRequest,
      })
    }

    const decodedEmailVerifyToken = decode(user.emailVerifyToken) as TokenPayload

    const nextEmailResendTime = new Date(
      decodedEmailVerifyToken.iat * 1000 + ms(envVariables.RESEND_EMAIL_DEBOUNCE_TIME)
    )

    const remainingTimeInMs = Math.max(0, nextEmailResendTime.getTime() - Date.now())

    if (remainingTimeInMs > 0) {
      throw new ErrorWithStatus({
        message: `Please try again in ${Math.ceil(remainingTimeInMs / 1000)} second(s)`,
        statusCode: HttpStatusCode.TooManyRequests,
      })
    }

    req.user = user
  }

  async updateEmailVerifyToken(userId: ObjectId) {
    const emailVerifyToken = await this.signEmailVerifyToken(userId.toHexString())

    await databaseService.users.updateOne(
      { _id: userId },
      { $set: { emailVerifyToken }, $currentDate: { updatedAt: true } }
    )

    return emailVerifyToken
  }

  async validateUserVerifyEmail(req: Request<ParamsDictionary, any, EmailVerifyTokenType>) {
    const { userId } = req.decodedEmailVerifyToken as TokenPayload

    const user = await profileService.findById(userId)

    if (!user) {
      throw new ErrorWithStatus({
        message: 'Email does not exist in the system',
        statusCode: HttpStatusCode.NotFound,
      })
    }

    if (user.emailVerifyToken === null) {
      throw new ErrorWithStatus({
        message: 'Account has been verified',
        statusCode: HttpStatusCode.BadRequest,
      })
    }

    if (user.emailVerifyToken !== req.body.emailVerifyToken) {
      throw new ErrorWithStatus({
        message: 'Please check your email for the latest link or request a new one.',
        statusCode: HttpStatusCode.Unauthorized,
      })
    }
  }

  async verifyEmail(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId)
    const { iat, exp } = await verifyRefreshToken(refreshToken)

    await Promise.all([
      databaseService.users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { emailVerifyToken: null }, $currentDate: { updatedAt: true } }
      ),
      databaseService.refreshTokens.insertOne(
        new RefreshToken({ userId: new ObjectId(userId), token: refreshToken, iat, exp })
      ),
    ])

    return { accessToken, refreshToken }
  }

  async ensureUserExists(req: Request) {
    const { userId } = req.decodedAuthorization as TokenPayload

    const user = await profileService.findByIdWithoutSensitiveInfo(userId)

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        statusCode: HttpStatusCode.NotFound,
      })
    }

    req.user = user
  }

  async ensureUserExistsAndVerify(req: Request) {
    const { userId } = req.decodedAuthorization as TokenPayload

    const user = (await databaseService.users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0, resetPasswordToken: 0 } }
    )) as Omit<UserDocumentWithoutPassword, 'resetPasswordToken'> | null

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        statusCode: HttpStatusCode.NotFound,
      })
    }

    if (user.emailVerifyToken !== null) {
      throw new ErrorWithStatus({
        message: 'Email has not been verified',
        statusCode: HttpStatusCode.Forbidden,
      })
    }

    req.user = user
  }

  async validateUserLogin(req: Request<ParamsDictionary, any, LoginBodyType>) {
    const user = await databaseService.users.findOne({ email: req.body.email }, { projection: { password: 1 } })

    if (!user || user.password !== hashPassword(req.body.password)) {
      throw new EntityError({
        message: 'Validation error occurred in body',
        errors: [
          {
            code: z.ZodIssueCode.custom,
            message: 'Invalid email or password',
            location: 'body',
            path: 'email',
          },
        ],
      })
    }

    Object.keys(user).forEach((key) => {
      if (key !== '_id') {
        delete user[key as keyof typeof user]
      }
    })

    req.user = user
  }

  async login(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId)
    const { iat, exp } = await verifyRefreshToken(refreshToken)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ userId: new ObjectId(userId), token: refreshToken, iat, exp })
    )

    return { accessToken, refreshToken }
  }

  async validateRefreshTokenRequest(req: Request<ParamsDictionary, any, RefreshTokenType>) {
    const [decodedRefreshToken, findAndDeleteResult] = await Promise.all([
      verifyRefreshToken(req.body.refreshToken),
      databaseService.refreshTokens.findOneAndDelete({ token: req.body.refreshToken }),
    ])

    if (findAndDeleteResult === null) {
      throw new ErrorWithStatus({
        message: 'Jwt expired',
        statusCode: HttpStatusCode.Unauthorized,
      })
    }

    req.decodedRefreshToken = decodedRefreshToken
  }

  async refreshToken({ exp, userId }: { exp: number; userId: string }) {
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken(userId),
      this.signRefreshToken(userId, exp),
    ])

    const decodedRefreshToken = await verifyRefreshToken(newRefreshToken)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        userId: new ObjectId(userId),
        token: newRefreshToken,
        iat: decodedRefreshToken.iat,
        exp: decodedRefreshToken.exp,
      })
    )

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async logout(refreshToken: string) {
    const result = await databaseService.refreshTokens.deleteOne({ token: refreshToken })

    if (result.deletedCount === 0) {
      throw new ErrorWithStatus({
        message: 'Jwt expired',
        statusCode: HttpStatusCode.Unauthorized,
      })
    }
  }

  async validateChangePasswordRequest(req: Request<ParamsDictionary, any, ChangePasswordBodyType>) {
    const { userId } = req.decodedAuthorization as TokenPayload

    const user = await databaseService.users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { resetPasswordToken: 0 } }
    )

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        statusCode: HttpStatusCode.NotFound,
      })
    }

    if (user.emailVerifyToken !== null) {
      throw new ErrorWithStatus({
        message: 'Email has not been verified',
        statusCode: HttpStatusCode.Forbidden,
      })
    }

    if (user.password !== hashPassword(req.body.currentPassword)) {
      throw new EntityError({
        message: 'Validation error occurred in body',
        errors: [
          {
            code: z.ZodIssueCode.custom,
            message: 'Current password is incorrect',
            location: 'body',
            path: 'currentPassword',
          },
        ],
      })
    }

    if (req.body.newPassword === req.body.currentPassword) {
      throw new EntityError({
        message: 'Validation error occurred in body',
        errors: [
          {
            code: z.ZodIssueCode.custom,
            message: 'New password cannot be the same as the current password.',
            location: 'body',
            path: 'newPassword',
          },
        ],
      })
    }

    Object.keys(user).forEach((key) => {
      if (key !== '_id') {
        delete user[key as keyof typeof user]
      }
    })
  }

  async changePassword({ userId, newPassword }: { userId: string; newPassword: string }) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashPassword(newPassword) }, $currentDate: { updatedAt: true } }
    )
  }

  async validateForgotPasswordRequest(req: Request<ParamsDictionary, any, ForgotPasswordBodyType>) {
    const user = await profileService.findByEmail(req.body.email)

    if (!user) {
      throw new EntityError({
        message: 'Validation error occurred in body',
        errors: [
          {
            code: z.ZodIssueCode.custom,
            message: 'Email does not exist in the system',
            location: 'body',
            path: 'email',
          },
        ],
      })
    }
    req.user = user

    if (user.resetPasswordToken !== null) {
      const decodedResetPasswordToken = decode(user.resetPasswordToken) as TokenPayload

      const nextEmailResendTime = new Date(
        decodedResetPasswordToken.iat * 1000 + ms(envVariables.RESEND_EMAIL_DEBOUNCE_TIME)
      )

      const remainingTimeInMs = Math.max(0, nextEmailResendTime.getTime() - Date.now())

      if (remainingTimeInMs > 0) {
        throw new ErrorWithStatus({
          message: `Please try again in ${Math.ceil(remainingTimeInMs / 1000)} second(s)`,
          statusCode: HttpStatusCode.TooManyRequests,
        })
      }
    }
  }

  async updateResetPasswordToken(userId: string) {
    const resetPasswordToken = await signToken({
      payload: { userId, tokenType: TokenType.ResetPasswordToken },
      privateKey: envVariables.JWT_SECRET_RESET_PASSWORD_TOKEN,
      options: {
        expiresIn: envVariables.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN,
      },
    })

    await databaseService.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { resetPasswordToken }, $currentDate: { updatedAt: true } }
    )

    return resetPasswordToken
  }

  async validateResetPasswordTokenAndAttachUser(req: Request<ParamsDictionary, any, ResetPasswordBodyType>) {
    const { resetPasswordToken } = req.body

    try {
      const decodedResetPasswordToken = await verifyResetPasswordToken(resetPasswordToken)

      const user = await profileService.findById(decodedResetPasswordToken.userId)

      if (!user) {
        throw new ErrorWithStatus({
          message: 'Email does not exist in the system',
          statusCode: HttpStatusCode.NotFound,
        })
      }

      if (user.resetPasswordToken !== resetPasswordToken) {
        throw new ErrorWithStatus({
          message: 'Invalid reset password token. Please check your email for the latest link or request a new one.',
          statusCode: HttpStatusCode.BadRequest,
        })
      }

      req.user = user
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new ErrorWithStatusAndLocation({
          message: capitalizeFirstLetter(error.message),
          statusCode: HttpStatusCode.BadRequest,
          location: 'body',
          errorInfo: omit(error, ['message']),
        })
      } else {
        throw error
      }
    }
  }

  async resetPassword({ userId, password }: { userId: ObjectId; password: string }) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashPassword(password), resetPasswordToken: null }, $currentDate: { updatedAt: true } }
    )
  }
}

const authService = new AuthService()
export default authService
