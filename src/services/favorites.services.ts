import { ObjectId, WithId } from 'mongodb'

import Favorite from '@/models/favorite.model'
import { ErrorWithStatus } from '@/models/errors'
import { FAVORITE_PAGE_LIMIT } from '@/constants'
import { HttpStatusCode } from '@/constants/http-status-code'
import databaseService from '@/services/database.services'
import { MediaType } from '@/schemas/common-media.schema'
import { PaginationResponseType } from '@/schemas/common.schema'
import { AddFavoriteBodyType, FavoriteDocumentType } from '@/schemas/favorite.schema'

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

  async getMyFavorites(payload: { userId: string; page?: number }) {
    const { userId, page = 1 } = payload

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

  async deleteFavoriteById({ favoriteId, userId }: { favoriteId: string; userId: string }) {
    // Phải deleteOne theo _id và userId
    // Vì để tránh trường hợp người dùng xóa favorite của người khác
    const result = await databaseService.favorites.deleteOne({
      _id: new ObjectId(favoriteId),
      userId: new ObjectId(userId),
    })

    if (result.deletedCount === 0) {
      throw new ErrorWithStatus({
        message: 'Favorite not found or does not belong to you.',
        statusCode: HttpStatusCode.NotFound,
      })
    }
  }

  async checkIsFavoriteByMedia(payload: { mediaId: number; mediaType: MediaType; userId: string }) {
    const { mediaId, mediaType, userId } = payload

    const favorite = await databaseService.favorites.findOne({
      mediaId,
      mediaType,
      userId: new ObjectId(userId),
    })

    return {
      isFavorite: !!favorite,
    }
  }

  async deleteFavoriteByMedia(payload: { mediaId: number; mediaType: MediaType; userId: string }) {
    const { mediaId, mediaType, userId } = payload

    const result = await databaseService.favorites.deleteOne({
      mediaId,
      mediaType,
      userId: new ObjectId(userId),
    })

    if (result.deletedCount === 0) {
      throw new ErrorWithStatus({
        message: 'Favorite not found or does not belong to you.',
        statusCode: HttpStatusCode.NotFound,
      })
    }
  }
}

const favoritesService = new FavoritesService()
export default favoritesService
