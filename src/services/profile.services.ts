import omit from 'lodash/omit'
import { ObjectId } from 'mongodb'

import { ErrorWithStatus } from '@/models/errors'
import { HttpStatusCode } from '@/constants/http-status-code'
import databaseService from '@/services/database.services'

class ProfileService {
  async findById(userId: string) {
    return databaseService.users.findOne({ _id: new ObjectId(userId) })
  }

  async findByEmail(email: string) {
    return databaseService.users.findOne({ email })
  }

  async getProfile(userId: string) {
    const user = await this.findById(userId)

    if (!user) {
      throw new ErrorWithStatus({
        message: 'User not found',
        statusCode: HttpStatusCode.NotFound,
      })
    }

    return omit({ ...user, _id: user._id.toHexString(), is_verified: user.email_verify_token === null }, [
      'email_verify_token',
      'forgot_password_token',
      'password',
    ])
  }
}

const profileService = new ProfileService()
export default profileService
