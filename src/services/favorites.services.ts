import { ObjectId, WithId } from 'mongodb'

import Favorite from '@/models/favorite.model'
import databaseService from '@/services/database.services'
import { AddFavoriteBodyType } from '@/schemas/favorite.schema'

class FavoritesService {
  async addFavoriteMedia(payload: AddFavoriteBodyType & { userId: string }) {
    const { mediaId, posterPath, releaseDate, title, type, userId } = payload

    const favorite = await databaseService.favorites.findOneAndUpdate(
      { media_id: mediaId, user_id: new ObjectId(userId) },
      {
        $setOnInsert: new Favorite({
          _id: new ObjectId(),
          user_id: new ObjectId(userId),
          media_id: mediaId,
          title,
          type,
          poster_path: posterPath,
          release_date: releaseDate,
        }),
      },
      {
        upsert: true,
        includeResultMetadata: true,
        returnDocument: 'after',
      }
    )

    return {
      data: favorite.value as WithId<Favorite>,
      isNew: favorite.lastErrorObject?.updatedExisting === false,
    }
  }

  async getFavoritesByUserId(userId: string) {
    return databaseService.favorites.find({ user_id: new ObjectId(userId) }).toArray()
  }
}

const favoritesService = new FavoritesService()
export default favoritesService
