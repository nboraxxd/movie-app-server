import User from '@/models/user.model'
import { hashPassword } from '@/utils/crypto'
import { RegisterBodyType } from '@/schemas/user.schema'
import databaseService from '@/services/database.services'
import { signToken } from '@/utils/jwt'
import { TokenType } from '@/constants/type'
import envVariables from '@/schemas/env-variables.schema'
import { ObjectId } from 'mongodb'
import { sendEmail } from '@/utils/mailgun'
import { EMAIL_TEMPLATES } from '@/constants/email-templates'

class UsersService {
  private async signAccessToken(userId: string, isVerified: boolean) {
    return signToken({
      payload: { userId, tokenType: TokenType.AccessToken, isVerified },
      privateKey: envVariables.JWT_SECRET_ACCESS_TOKEN,
      options: {
        expiresIn: envVariables.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    })
  }

  private async signRefreshToken(userId: string, isVerified: boolean) {
    return signToken({
      payload: { userId, tokenType: TokenType.RefreshToken, isVerified },
      privateKey: envVariables.JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: envVariables.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    })
  }

  private async signAccessTokenAndRefreshToken(userId: string, isVerified: boolean) {
    return Promise.all([this.signAccessToken(userId, isVerified), this.signRefreshToken(userId, isVerified)])
  }

  private async signEmailVerifyToken(userId: string, isVerified: boolean) {
    return signToken({
      payload: { userId, token_type: TokenType.EmailVerifyToken, isVerified },
      privateKey: envVariables.JWT_SECRET_EMAIL_VERIFY_TOKEN,
      options: {
        expiresIn: envVariables.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN,
      },
    })
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
      sendEmail({
        name,
        email,
        subject: '[nmovies] Verify your email',
        html: EMAIL_TEMPLATES.EMAIL_VERIFICATION({
          name,
          link: `${envVariables.CLIENT_URL}/verify-email?token=${emailVerifyToken}`,
        }),
      }),
    ])

    return { accessToken, refreshToken }
  }
}

const usersService = new UsersService()
export default usersService
