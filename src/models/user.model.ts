import { ObjectId } from 'mongodb'

type UserType = {
  _id?: ObjectId
  name: string
  email: string
  password: string
  email_verify_token?: string
  forgot_password_token?: string
  avatar?: string
  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  email_verify_token: string | null
  forgot_password_token: string | null
  avatar: string | null
  created_at: Date
  updated_at: Date

  constructor(user: UserType) {
    const currentDate = new Date()

    this._id = user._id
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.email_verify_token = user.email_verify_token || null
    this.forgot_password_token = user.forgot_password_token || null
    this.avatar = user.avatar || null
    this.created_at = user.created_at || currentDate
    this.updated_at = user.updated_at || currentDate
  }
}
