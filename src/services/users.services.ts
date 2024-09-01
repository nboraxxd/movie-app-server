import User from '@/models/user.model'
import databaseService from '@/services/database.services'
import { RegisterBodyType } from '@/schemas/user.schema'

class UsersService {
  async register(payload: Omit<RegisterBodyType, 'confirmPassword'>) {
    const { email, name, password } = payload

    await databaseService.users.insertOne(new User({ email, name, password }))

    return { message: 'Register success' }
  }
}

const usersService = new UsersService()
export default usersService
