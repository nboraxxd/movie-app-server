import { ObjectId, WithId } from 'mongodb'

import Favorite from '@/models/favorite.model'
import databaseService from '@/services/database.services'
import { AddFavoriteBodyType } from '@/schemas/favorite.schema'

class FavoritesService {
  async getMediaFavoritesMap(payload: { medias: Array<{ id: number; type: 'movie' | 'tv' }>; userId?: string }) {
    const { medias, userId } = payload

    const mediaFavoritesMap: Record<number, Array<'movie' | 'tv'>> = {}

    if (userId) {
      const favoriteRecords = await databaseService.favorites
        .find(
          {
            userId: new ObjectId(userId),
            $or: medias.map((media) => ({
              mediaId: media.id,
              type: media.type,
            })),
          },
          { projection: { mediaId: 1, type: 1 } }
        )
        .toArray()

      for (const { mediaId, type } of favoriteRecords) {
        if (mediaId in mediaFavoritesMap) {
          mediaFavoritesMap[mediaId].push(type)
        } else {
          mediaFavoritesMap[mediaId] = [type]
        }
      }
    }

    return mediaFavoritesMap
  }

  async addFavoriteMedia(payload: AddFavoriteBodyType & { userId: string }) {
    const { mediaId, posterPath, releaseDate, title, type, userId } = payload

    const favorite = await databaseService.favorites.findOneAndUpdate(
      { media_id: mediaId, user_id: new ObjectId(userId) },
      {
        $setOnInsert: new Favorite({
          _id: new ObjectId(),
          userId: new ObjectId(userId),
          mediaId,
          title,
          type,
          posterPath,
          releaseDate,
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

  async getFavorite(payload: { mediaId: number; type: 'movie' | 'tv'; userId: string }) {
    const { mediaId, type, userId } = payload

    return databaseService.favorites.findOne({ mediaId, type, userId: new ObjectId(userId) })
  }
}

const favoritesService = new FavoritesService()
export default favoritesService
