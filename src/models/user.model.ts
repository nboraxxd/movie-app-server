import { ObjectId } from 'mongodb'

type UserType = {
  _id?: ObjectId
  name: string
  email: string
  password: string
  emailVerifyToken?: string
  forgotPasswordToken?: string
  avatar?: string
  createdAt?: Date
  updatedAt?: Date
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  emailVerifyToken: string | null
  forgotPasswordToken: string | null
  avatar: string | null
  createdAt: Date
  updatedAt: Date

  constructor(user: UserType) {
    const currentDate = new Date()

    this._id = user._id
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.emailVerifyToken = user.emailVerifyToken || null
    this.forgotPasswordToken = user.forgotPasswordToken || null
    this.avatar = user.avatar || null
    this.createdAt = user.createdAt || currentDate
    this.updatedAt = user.updatedAt || currentDate
  }
}
