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
import { EmailVerifyTokenType, LoginBodyType, RefreshTokenType } from '@/schemas/auth.schema'
import { RegisterBodyType } from '@/schemas/auth.schema'
import envVariables from '@/schemas/env-variables.schema'
import databaseService from '@/services/database.services'
import usersService from '@/services/users.services'

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
      ),
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

  private async signForgotPasswordToken(userId: string) {
    return signToken({
      payload: { userId, token_type: TokenType.ForgotPasswordToken },
      privateKey: envVariables.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
      options: {
        expiresIn: envVariables.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN,
      },
    })
  }

  async signEmailVerifyToken(userId: string) {
    return signToken({
      payload: { userId, token_type: TokenType.EmailVerifyToken },
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
    const user = await usersService.findByEmail(req.body.email)

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
        new User({ _id: userId, email, name, password: hashPassword(password), email_verify_token: emailVerifyToken })
      ),
      databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: userId, token: refreshToken, iat, exp })),
      this.sendVerificationEmail({ email, name, token: emailVerifyToken }),
    ])

    return { accessToken, refreshToken }
  }

  async validateUserResendEmailVerification(req: Request<ParamsDictionary, any, EmailVerifyTokenType>) {
    const { userId } = req.decodedAuthorization as TokenPayload

    const user = await usersService.findById(userId)

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        statusCode: HttpStatusCode.NotFound,
      })
    }

    if (user.email_verify_token === null) {
      throw new ErrorWithStatus({
        message: 'Account has been verified',
        statusCode: HttpStatusCode.BadRequest,
      })
    }

    req.user = user
  }

  async resendEmailVerification(payload: { userId: ObjectId; email: string; name: string }) {
    const { email, name, userId } = payload

    const emailVerifyToken = await this.signEmailVerifyToken(userId.toHexString())

    await Promise.all([
      databaseService.users.updateOne(
        { _id: userId },
        { $set: { email_verify_token: emailVerifyToken }, $currentDate: { updated_at: true } }
      ),
      this.sendVerificationEmail({ email, name, token: emailVerifyToken }),
    ])
  }

  async validateUserVerifyEmail(req: Request<ParamsDictionary, any, EmailVerifyTokenType>) {
    const { userId } = req.decodedEmailVerifyToken as TokenPayload

    const user = await usersService.findById(userId)

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        statusCode: HttpStatusCode.NotFound,
      })
    }

    if (user.email_verify_token === null) {
      throw new ErrorWithStatus({
        message: 'Account has been verified',
        statusCode: HttpStatusCode.BadRequest,
      })
    }

    if (user.email_verify_token !== req.body.emailVerifyToken) {
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
        { $set: { email_verify_token: null }, $currentDate: { updated_at: true } }
      ),
      databaseService.refreshTokens.insertOne(
        new RefreshToken({ user_id: new ObjectId(userId), token: refreshToken, iat, exp })
      ),
    ])

    return { accessToken, refreshToken }
  }

  async validateUserLogin(req: Request<ParamsDictionary, any, LoginBodyType>) {
    const user = await usersService.findByEmail(req.body.email)

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

    req.user = user
  }

  async login(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId)
    const { iat, exp } = await this.decodeRefreshToken(refreshToken)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(userId), token: refreshToken, iat, exp })
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
        user_id: new ObjectId(userId),
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
}

const authService = new AuthService()
export default authService
