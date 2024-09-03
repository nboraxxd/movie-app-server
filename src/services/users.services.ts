import z from 'zod'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'

import { hashPassword } from '@/utils/crypto'
import User from '@/models/user.model'
import { EntityError } from '@/models/errors'
import RefreshToken from '@/models/refresh-token.model'
import { LoginBodyType } from '@/schemas/auth.schema'
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

  // Phải dùng arrow function để this trỏ đến class UsersService
  validateUserLogin = async (req: Request<ParamsDictionary, any, LoginBodyType>) => {
    const user = await this.findByEmail(req.body.email)

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

  // Phải dùng arrow function để this trỏ đến class UsersService
  validateUserRegister = async (req: Request<ParamsDictionary, any, RegisterBodyType>) => {
    const user = await this.findByEmail(req.body.email)

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
      authService.signEmailVerifyToken(userId.toHexString()),
      authService.signAccessToken(userId.toHexString()),
      authService.signRefreshToken(userId.toHexString()),
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
