import { ObjectId } from 'mongodb'

import User from '@/models/user.model'
import RefreshToken from '@/models/refresh-token.model'
import { hashPassword } from '@/utils/crypto'
import { RegisterBodyType } from '@/schemas/user.schema'
import databaseService from '@/services/database.services'
import authService from '@/services/auth.services'

class UsersService {
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
      authService.signEmailVerifyToken(userId.toHexString(), false),
      authService.signAccessToken(userId.toHexString(), false),
      authService.signRefreshToken(userId.toHexString(), false),
    ])

    await Promise.all([
      databaseService.users.insertOne(
        new User({ _id: userId, email, name, password: hashPassword(password), email_verify_token: emailVerifyToken })
      ),
      databaseService.refreshTokens.insertOne(new RefreshToken({ user_id: userId, token: refreshToken })),
      authService.sendVerificationEmail({ email, name, token: emailVerifyToken }),
    ])

    return { accessToken, refreshToken }
  }
}

const usersService = new UsersService()
export default usersService
