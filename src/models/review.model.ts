import { ObjectId } from 'mongodb'
import { MediaType } from '@/schemas/common-media.schema'

type ReviewType = {
  _id?: ObjectId
  userId: ObjectId
  mediaId: number
  mediaTitle: string
  mediaType: MediaType
  mediaPoster: string | null
  mediaReleaseDate: string
  content: string
  createdAt?: Date
  updatedAt?: Date
}

export default class Review {
  _id?: ObjectId
  userId: ObjectId
  mediaId: number
  mediaTitle: string
  mediaType: MediaType
  mediaPoster: string | null
  mediaReleaseDate: string
  content: string
  createdAt: Date
  updatedAt: Date

  constructor(review: ReviewType) {
    const currentDate = new Date()

    this._id = review._id
    this.userId = review.userId
    this.mediaId = review.mediaId
    this.mediaTitle = review.mediaTitle
    this.mediaType = review.mediaType
    this.mediaPoster = review.mediaPoster
    this.mediaReleaseDate = review.mediaReleaseDate
    this.content = review.content
    this.createdAt = review.createdAt || currentDate
    this.updatedAt = review.updatedAt || currentDate
  }
}
