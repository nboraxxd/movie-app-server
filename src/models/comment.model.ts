import { ObjectId } from 'mongodb'
import { MediaType } from '@/schemas/common-media.schema'

type CommentType = {
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

export default class Comment {
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

  constructor(comment: CommentType) {
    const currentDate = new Date()

    this._id = comment._id
    this.userId = comment.userId
    this.mediaId = comment.mediaId
    this.mediaTitle = comment.mediaTitle
    this.mediaType = comment.mediaType
    this.mediaPoster = comment.mediaPoster
    this.mediaReleaseDate = comment.mediaReleaseDate
    this.content = comment.content
    this.createdAt = comment.createdAt || currentDate
    this.updatedAt = comment.updatedAt || currentDate
  }
}
