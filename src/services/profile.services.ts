import z from 'zod'
import omit from 'lodash/omit'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'

import { hashPassword } from '@/utils/crypto'
import { HttpStatusCode } from '@/constants/http-status-code'
import databaseService from '@/services/database.services'
import { EntityError, ErrorWithStatus } from '@/models/errors'
import { UserDocument, UserDocumentWithoutPassword } from '@/models/user.model'
import { VerifyPasswordBodyType, UpdateProfileBodyType, UpdateProfileResponseType } from '@/schemas/profile.schema'

class ProfileService {
  async findById(userId: string) {
    return databaseService.users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    ) as Promise<UserDocumentWithoutPassword>
  }

  async findByEmail(email: string) {
    return databaseService.users.findOne(
      { email },
      { projection: { password: 0 } }
    ) as Promise<UserDocumentWithoutPassword>
  }

  async getProfile(userId: string) {
    const user = await this.findById(userId)

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        statusCode: HttpStatusCode.NotFound,
      })
    }

    return omit({ ...user, _id: user._id.toHexString(), isVerified: user.emailVerifyToken === null }, [
      'emailVerifyToken',
    ])
  }

  async hasFieldToUpdate(req: Request<ParamsDictionary, any, UpdateProfileBodyType>) {
    if (Object.keys(req.body).length === 0) {
      throw new ErrorWithStatus({
        message: 'At least one field is required to update',
        statusCode: HttpStatusCode.BadRequest,
      })
    }
  }

  async updateProfile(
    userId: string,
    payload: UpdateProfileBodyType
  ): Promise<Omit<UpdateProfileResponseType, 'message'>['data']> {
    // Remove fields with undefined values from payload
    Object.keys(payload).forEach((key) => {
      if (payload[key as keyof typeof payload] === undefined) {
        delete payload[key as keyof typeof payload]
      }
    })

    const result = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: payload, $currentDate: { updatedAt: true } },
      {
        projection: { password: 0, resetPasswordToken: 0 },
        returnDocument: 'after',
      }
    )

    if (!result) {
      throw new ErrorWithStatus({ message: 'User not found', statusCode: HttpStatusCode.NotFound })
    }

    return omit({ ...result, _id: result._id.toHexString(), isVerified: result.emailVerifyToken === null }, [
      'emailVerifyToken',
    ])
  }

  async validateUserPassword(req: Request<ParamsDictionary, any, VerifyPasswordBodyType>) {
    const user = req.user as UserDocument

    if (user.password !== hashPassword(req.body.password)) {
      throw new EntityError({
        message: 'Validation error occurred in body',
        errors: [
          {
            code: z.ZodIssueCode.custom,
            message: 'Password is incorrect',
            location: 'body',
            path: 'password',
          },
        ],
      })
    }
  }

  async deleteMyAccount(userId: ObjectId) {
    const session = databaseService.client.startSession()
    session.startTransaction()

    try {
      const result = await databaseService.users.deleteOne({ _id: userId }, { session })

      if (!result.deletedCount) {
        throw new ErrorWithStatus({
          message: 'User not found',
          statusCode: HttpStatusCode.NotFound,
        })
      }

      await Promise.all([
        databaseService.favorites.deleteMany({ userId }, { session }),
        databaseService.comments.deleteMany({ userId }, { session }),
        databaseService.refreshTokens.deleteMany({ userId }, { session }),
      ])

      await session.commitTransaction()
    } catch (error: any) {
      await session.abortTransaction()
      throw new ErrorWithStatus({
        message: error.message || 'Delete account failed',
        statusCode: HttpStatusCode.InternalServerError,
      })
    } finally {
      session.endSession()
    }
  }
}

const profileService = new ProfileService()
export default profileService
