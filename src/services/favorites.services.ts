import { ObjectId, WithId } from 'mongodb'

import Favorite from '@/models/favorite.model'
import databaseService from '@/services/database.services'
import { MediaType } from '@/schemas/common-media.schema'
import { AddFavoriteBodyType, FavoriteDocumentType } from '@/schemas/favorite.schema'
import { FAVORITE_PAGE_LIMIT } from '@/constants'
import { PaginationResponseType } from '@/schemas/common.schema'

class FavoritesService {
  async getMediaFavoritesMap(payload: { medias: Array<{ id: number; type: MediaType }>; userId?: string }) {
    const { medias, userId } = payload

    const mediaFavoritesMap: Record<number, Array<MediaType>> = {}

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

      for (const { mediaId, mediaType } of favoriteRecords) {
        if (mediaId in mediaFavoritesMap) {
          mediaFavoritesMap[mediaId].push(mediaType)
        } else {
          mediaFavoritesMap[mediaId] = [mediaType]
        }
      }
    }

    return mediaFavoritesMap
  }

  async addFavoriteMedia(payload: AddFavoriteBodyType & { userId: string }) {
    const { mediaId, mediaPoster, mediaReleaseDate, mediaTitle, mediaType, userId } = payload

    const favorite = await databaseService.favorites.findOneAndUpdate(
      { mediaId, userId: new ObjectId(userId) },
      {
        $setOnInsert: new Favorite({
          _id: new ObjectId(),
          userId: new ObjectId(userId),
          mediaId,
          mediaPoster,
          mediaReleaseDate,
          mediaTitle,
          mediaType,
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

  async getFavorite(payload: { mediaId: number; mediaType: 'movie' | 'tv'; userId: string }) {
    const { mediaId, mediaType, userId } = payload

    return databaseService.favorites.findOne({ mediaId, mediaType, userId: new ObjectId(userId) })
  }

  async getMyFavorites(payload: { userId: string; page: number }) {
    const { userId, page } = payload

    const [response] = await databaseService.favorites
      .aggregate<{
        data: WithId<Omit<FavoriteDocumentType, '_id' | 'userId'>>[]
        pagination: PaginationResponseType
      }>([
        {
          $match: {
            userId: new ObjectId(userId),
          },
        },
        {
          $facet: {
            data: [
              {
                $project: {
                  userId: 0,
                },
              },
              {
                $skip: (page - 1) * FAVORITE_PAGE_LIMIT,
              },
              {
                $limit: FAVORITE_PAGE_LIMIT,
              },
            ],
            totalCount: [
              {
                $count: 'count',
              },
            ],
          },
        },
        {
          $project: {
            data: 1,
            pagination: {
              currentPage: { $literal: page },
              totalPages: {
                $ceil: {
                  $divide: [
                    {
                      $ifNull: [
                        {
                          $arrayElemAt: ['$totalCount.count', 0],
                        },
                        0,
                      ],
                    },
                    FAVORITE_PAGE_LIMIT,
                  ],
                },
              },
              count: {
                $ifNull: [
                  {
                    $arrayElemAt: ['$totalCount.count', 0],
                  },
                  0,
                ],
              },
            },
          },
        },
      ])
      .toArray()

    return response
  }
}

const favoritesService = new FavoritesService()
export default favoritesService
