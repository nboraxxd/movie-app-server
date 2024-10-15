import ms from 'ms'
import z from 'zod'
import { ObjectId } from 'mongodb'
import { Request } from 'express'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { ParamsDictionary } from 'express-serve-static-core'

import User from '@/models/user.model'
import { EntityError, ErrorWithStatus } from '@/models/errors'
import RefreshToken from '@/models/refresh-token.model'
import { TokenPayload } from '@/types/token.type'
import { TokenType } from '@/constants/type'
import { EMAIL_TEMPLATES } from '@/constants/email-templates'
import { HttpStatusCode } from '@/constants/http-status-code'
import { signToken, verifyToken } from '@/utils/jwt'
import { sendEmail } from '@/utils/mailgun'
import { hashPassword } from '@/utils/crypto'
import databaseService from '@/services/database.services'
import profileService from '@/services/profile.services'
import { ForgotPasswordBodyType, RegisterBodyType } from '@/schemas/auth.schema'
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

  private decodeRefreshToken(token: string) {
    return verifyToken({
      token,
      jwtKey: envVariables.JWT_SECRET_REFRESH_TOKEN,
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

  async sendVerificationEmail({ email, name, token }: { email: string; name: string; token: string }) {
    return sendEmail({
      name,
      email,
      subject: '[nmovies] Verify your email',
      html: EMAIL_TEMPLATES.EMAIL_VERIFICATION({
        name,
        link: `${envVariables.CLIENT_URL}/verify-email?token=${token}`,
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

  async register(payload: Omit<RegisterBodyType, 'confirmPassword'>) {
    const { email, name, password } = payload

    const userId = new ObjectId()

    const [emailVerifyToken, accessToken, refreshToken] = await Promise.all([
      this.signEmailVerifyToken(userId.toHexString()),
      this.signAccessToken(userId.toHexString()),
      this.signRefreshToken(userId.toHexString()),
    ])

    const { iat, exp } = await this.decodeRefreshToken(refreshToken)

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

    const decodedEmailVerifyToken = await verifyToken({
      token: user.emailVerifyToken,
      jwtKey: envVariables.JWT_SECRET_EMAIL_VERIFY_TOKEN,
    })

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

    if (user.emailVerifyToken !== req.body.emailVerifyToken) {
      throw new ErrorWithStatus({
        message: 'Invalid email verify token',
        statusCode: HttpStatusCode.Unauthorized,
      })
    }
  }

  async verifyEmail(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId)
    const { iat, exp } = await this.decodeRefreshToken(refreshToken)

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

    const user = await databaseService.users.findOne({ _id: new ObjectId(userId) })

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

    const user = await profileService.findById(userId)

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
    const { iat, exp } = await this.decodeRefreshToken(refreshToken)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ userId: new ObjectId(userId), token: refreshToken, iat, exp })
    )

    return { accessToken, refreshToken }
  }

  async validateRefreshTokenRequest(req: Request<ParamsDictionary, any, RefreshTokenType>) {
    const [decodedRefreshToken, findAndDeleteResult] = await Promise.all([
      await verifyToken({
        token: req.body.refreshToken,
        jwtKey: envVariables.JWT_SECRET_REFRESH_TOKEN,
      }),
      databaseService.refreshTokens.findOneAndDelete({ token: req.body.refreshToken }),
    ])

    if (findAndDeleteResult === null) {
      throw new ErrorWithStatus({
        message: 'Invalid refresh token',
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

    const decodedRefreshToken = await this.decodeRefreshToken(newRefreshToken)

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
        message: 'Invalid refresh token',
        statusCode: HttpStatusCode.Unauthorized,
      })
    }
  }

  async validateChangePasswordRequest(req: Request<ParamsDictionary, any, ChangePasswordBodyType>) {
    const { userId } = req.decodedAuthorization as TokenPayload

    const user = await databaseService.users.findOne({ _id: new ObjectId(userId) })

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

    if (user.forgotPasswordToken !== null) {
      const decodedToken = await verifyToken({
        token: user.forgotPasswordToken,
        jwtKey: envVariables.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
      })

      const nextEmailResendTime = new Date(decodedToken.iat * 1000 + ms(envVariables.RESEND_EMAIL_DEBOUNCE_TIME))

      const remainingTimeInMs = Math.max(0, nextEmailResendTime.getTime() - Date.now())

      if (remainingTimeInMs > 0) {
        throw new ErrorWithStatus({
          message: `Please try again in ${Math.ceil(remainingTimeInMs / 1000)} second(s)`,
          statusCode: HttpStatusCode.TooManyRequests,
        })
      }
    }

    req.user = user
  }

  async updateForgotPasswordToken(userId: string) {
    const forgotPasswordToken = await signToken({
      payload: { userId, tokenType: TokenType.ForgotPasswordToken },
      privateKey: envVariables.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
      options: {
        expiresIn: envVariables.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN,
      },
    })

    await databaseService.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { forgotPasswordToken }, $currentDate: { updatedAt: true } }
    )

    return forgotPasswordToken
  }
}

const authService = new AuthService()
export default authService
