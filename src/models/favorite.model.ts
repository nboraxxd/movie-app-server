import { ObjectId } from 'mongodb'

type FavoriteType = {
  _id?: ObjectId
  userId: ObjectId
  mediaId: number
  title: string
  type: 'movie' | 'tv'
  posterPath: string | null
  releaseDate: string
  createdAt?: Date
}

export default class Favorite {
  _id?: ObjectId
  userId: ObjectId
  mediaId: number
  title: string
  type: 'movie' | 'tv'
  posterPath: string | null
  releaseDate: string
  createdAt: Date

  constructor(favorite: FavoriteType) {
    this._id = favorite._id
    this.userId = favorite.userId
    this.mediaId = favorite.mediaId
    this.title = favorite.title
    this.type = favorite.type
    this.posterPath = favorite.posterPath
    this.releaseDate = favorite.releaseDate
    this.createdAt = favorite.createdAt || new Date()
  }
}
