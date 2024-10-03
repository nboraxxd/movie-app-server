import { ObjectId } from 'mongodb'

type FavoriteType = {
  _id?: ObjectId
  user_id: ObjectId
  media_id: number
  title: string
  type: 'movie' | 'tv'
  poster_path: string | null
  release_date: string
  created_at?: Date
}

export default class Favorite {
  _id?: ObjectId
  user_id: ObjectId
  media_id: number
  title: string
  type: 'movie' | 'tv'
  poster_path: string | null
  release_date: string
  created_at: Date

  constructor(favorite: FavoriteType) {
    this._id = favorite._id
    this.user_id = favorite.user_id
    this.media_id = favorite.media_id
    this.title = favorite.title
    this.type = favorite.type
    this.poster_path = favorite.poster_path
    this.release_date = favorite.release_date
    this.created_at = favorite.created_at || new Date()
  }
}
