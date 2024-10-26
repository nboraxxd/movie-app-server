import { ObjectId } from 'mongodb'

type UserType = {
  _id?: ObjectId
  name: string
  email: string
  password: string
  emailVerifyToken?: string
  resetPasswordToken?: string
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
  resetPasswordToken: string | null
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
    this.resetPasswordToken = user.resetPasswordToken || null
    this.avatar = user.avatar || null
    this.createdAt = user.createdAt || currentDate
    this.updatedAt = user.updatedAt || currentDate
  }
}

export type UserDocument = Required<User>

export type UserDocumentWithoutPassword = Omit<Required<User>, 'password'>

export type UserDocumentWithoutSensitiveInfo = Omit<
  Required<User>,
  'password' | 'emailVerifyToken' | 'resetPasswordToken'
>
