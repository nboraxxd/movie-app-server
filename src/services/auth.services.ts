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
  private async signAccessTokenAndRefreshToken(userId: string, isVerified: boolean) {
    return Promise.all([this.signAccessToken(userId, isVerified), this.signRefreshToken(userId, isVerified)])
  }

  private async signForgotPasswordToken(userId: string, isVerified: boolean) {
    return signToken({
      payload: { userId, token_type: TokenType.ForgotPasswordToken, isVerified },
      privateKey: envVariables.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
      options: {
        expiresIn: envVariables.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN,
      },
    })
  }

  async signAccessToken(userId: string, isVerified: boolean) {
    return signToken({
      payload: { userId, tokenType: TokenType.AccessToken, isVerified },
      privateKey: envVariables.JWT_SECRET_ACCESS_TOKEN,
      options: {
        expiresIn: envVariables.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    })
  }

  async signRefreshToken(userId: string, isVerified: boolean) {
    return signToken({
      payload: { userId, tokenType: TokenType.RefreshToken, isVerified },
      privateKey: envVariables.JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: envVariables.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    })
  }

  async signEmailVerifyToken(userId: string, isVerified: boolean) {
    return signToken({
      payload: { userId, token_type: TokenType.EmailVerifyToken, isVerified },
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

  async findById(userId: string) {
    return databaseService.users.findOne({ _id: new ObjectId(userId) })
  }

  async findByEmail(email: string) {
    return databaseService.users.findOne({ email })
  }

  async register(payload: Omit<RegisterBodyType, 'confirmPassword'>) {
    const { email, name, password } = payload

    const userId = new ObjectId()

    const [emailVerifyToken, accessToken, refreshToken] = await Promise.all([
      this.signEmailVerifyToken(userId.toHexString(), false),
      this.signAccessToken(userId.toHexString(), false),
      this.signRefreshToken(userId.toHexString(), false),
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

    const emailVerifyToken = await this.signEmailVerifyToken(userId.toHexString(), false)

    await Promise.all([
      databaseService.users.updateOne(
        { _id: userId },
        { $set: { email_verify_token: emailVerifyToken }, $currentDate: { updated_at: true } }
      ),
      this.sendVerificationEmail({ email, name, token: emailVerifyToken }),
    ])
  }

  async verifyEmail(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId, true)

    await Promise.all([
      databaseService.users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { email_verify_token: null }, $currentDate: { updated_at: true } }
      ),
      databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: new ObjectId(userId), token: refreshToken })),
    ])

    return { accessToken, refreshToken }
  }

  async login(payload: { userId: string; isVerified: boolean }) {
    const { isVerified, userId } = payload

    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(userId, isVerified)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(userId), token: refreshToken })
    )

    return { accessToken, refreshToken }
  }
}

const authService = new AuthService()
export default authService
