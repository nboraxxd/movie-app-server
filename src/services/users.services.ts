import { ObjectId } from 'mongodb'
import databaseService from '@/services/database.services'

class UsersService {
  async findById(userId: string) {
    return databaseService.users.findOne({ _id: new ObjectId(userId) })
  }

  async findByEmail(email: string) {
    return databaseService.users.findOne({ email })
  }
}

const usersService = new UsersService()
export default usersService
