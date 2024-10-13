import { ObjectId } from 'mongodb'

type RefreshTokenType = {
  _id?: ObjectId
  token: string
  userId: ObjectId
  iat: number
  exp: number
  createdAt?: Date
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  userId: ObjectId
  iat: Date
  exp: Date
  createdAt?: Date

  constructor(refreshToken: RefreshTokenType) {
    this._id = refreshToken._id
    this.token = refreshToken.token
    this.userId = refreshToken.userId
    this.iat = new Date(refreshToken.iat * 1000)
    this.exp = new Date(refreshToken.exp * 1000)
    this.createdAt = refreshToken.createdAt || new Date()
  }
}
