import { ObjectId } from 'mongodb'

type RefreshTokenType = {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  iat: number
  exp: number
  created_at?: Date
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  iat: Date
  exp: Date
  created_at?: Date

  constructor(refreshToken: RefreshTokenType) {
    this._id = refreshToken._id
    this.token = refreshToken.token
    this.user_id = refreshToken.user_id
    this.iat = new Date(refreshToken.iat * 1000)
    this.exp = new Date(refreshToken.exp * 1000)
    this.created_at = refreshToken.created_at || new Date()
  }
}
