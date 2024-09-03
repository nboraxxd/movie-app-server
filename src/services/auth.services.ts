import { ObjectId } from 'mongodb'

import User from '@/models/user.model'
import RefreshToken from '@/models/refresh-token.model'
import { TokenType } from '@/constants/type'
import { EMAIL_TEMPLATES } from '@/constants/email-templates'
import { signToken } from '@/utils/jwt'
import { sendEmail } from '@/utils/mailgun'
import { hashPassword } from '@/utils/crypto'
import { RegisterBodyType } from '@/schemas/user.schema'
import envVariables from '@/schemas/env-variables.schema'
import databaseService from '@/services/database.services'

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

  async signRefreshToken(userId: string) {
    return signToken({
      payload: { userId, tokenType: TokenType.RefreshToken },
      privateKey: envVariables.JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: envVariables.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
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

  async register(payload: Omit<RegisterBodyType, 'confirmPassword'>) {
    const { email, name, password } = payload

    const userId = new ObjectId()

    const [emailVerifyToken, accessToken, refreshToken] = await Promise.all([
      this.signEmailVerifyToken(userId.toHexString()),
      this.signAccessToken(userId.toHexString()),
      this.signRefreshToken(userId.toHexString()),
    ])

    await Promise.all([
      databaseService.users.insertOne(
        new User({ _id: userId, email, name, password: hashPassword(password), email_verify_token: emailVerifyToken })
      ),
      databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: userId, token: refreshToken })),
      this.sendVerificationEmail({ email, name, token: emailVerifyToken }),
    ])

    return { accessToken, refreshToken }
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

  async verifyEmail(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId)

    await Promise.all([
      databaseService.users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { email_verify_token: null }, $currentDate: { updated_at: true } }
      ),
      databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: new ObjectId(userId), token: refreshToken })),
    ])

    return { accessToken, refreshToken }
  }

  async login(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(userId), token: refreshToken })
    )

    return { accessToken, refreshToken }
  }

  async logout(refreshToken: string) {
    await databaseService.refreshTokens.deleteOne({ token: refreshToken })
  }
}

const authService = new AuthService()
export default authService
