import { ObjectId } from 'mongodb'
import { MediaType } from '@/schemas/common-media.schema'

type FavoriteType = {
  _id?: ObjectId
  userId: ObjectId
  mediaId: number
  mediaTitle: string
  mediaType: MediaType
  mediaPoster: string | null
  mediaReleaseDate: string
  createdAt?: Date
}

export default class Favorite {
  _id?: ObjectId
  userId: ObjectId
  mediaId: number
  mediaTitle: string
  mediaType: MediaType
  mediaPoster: string | null
  mediaReleaseDate: string
  createdAt: Date

  constructor(favorite: FavoriteType) {
    this._id = favorite._id
    this.userId = favorite.userId
    this.mediaId = favorite.mediaId
    this.mediaTitle = favorite.mediaTitle
    this.mediaType = favorite.mediaType
    this.mediaPoster = favorite.mediaPoster
    this.mediaReleaseDate = favorite.mediaReleaseDate
    this.createdAt = favorite.createdAt || new Date()
  }
}
