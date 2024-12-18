import { ObjectId, WithId } from 'mongodb'

import Review from '@/models/review.model'
import { ErrorWithStatus } from '@/models/errors'
import { REVIEW_PAGE_LIMIT } from '@/constants'
import { HttpStatusCode } from '@/constants/http-status-code'
import databaseService from '@/services/database.services'
import { MediaType } from '@/schemas/common-media.schema'
import { AddReviewBodyType, AggregatedReviewType } from '@/schemas/reviews.schema'

class ReviewsService {
  async addReview(payload: AddReviewBodyType & { userId: string }) {
    const { content, mediaId, mediaPoster, mediaReleaseDate, mediaTitle, mediaType, userId } = payload

    const currentDate = new Date()

    const review = new Review({
      _id: new ObjectId(),
      content,
      mediaId,
      mediaPoster,
      mediaReleaseDate,
      mediaTitle,
      mediaType,
      userId: new ObjectId(userId),
      createdAt: currentDate,
      updatedAt: currentDate,
    })

    await databaseService.reviews.insertOne(review)

    return review as WithId<Review>
  }

  async getReviewsByMedia(payload: { mediaId: number; mediaType: MediaType; cursor?: string }) {
    const { mediaId, mediaType, cursor } = payload

    const [response] = await databaseService.reviews
      .aggregate<{ data: AggregatedReviewType[]; hasNextPage: boolean }>([
        {
          $match: {
            mediaId,
            mediaType,
            ...(cursor
              ? {
                  _id: {
                    $lt: new ObjectId(cursor),
                  },
                }
              : {}),
          },
        },
        {
          $facet: {
            data: [
              {
                $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              {
                $addFields: {
                  user: {
                    $arrayElemAt: ['$user', 0],
                  },
                },
              },
              {
                $addFields: {
                  'user.isVerified': {
                    $cond: {
                      if: {
                        $eq: ['$user.emailVerifyToken', null],
                      },
                      then: true,
                      else: false,
                    },
                  },
                },
              },
              {
                $project: {
                  userId: 0,
                  user: {
                    password: 0,
                    resetPasswordToken: 0,
                    emailVerifyToken: 0,
                    createdAt: 0,
                    updatedAt: 0,
                  },
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $limit: REVIEW_PAGE_LIMIT + 1,
              },
            ],
          },
        },
        {
          $project: {
            data: {
              $slice: ['$data', REVIEW_PAGE_LIMIT],
            },
            hasNextPage: {
              $gt: [
                {
                  $size: '$data',
                },
                REVIEW_PAGE_LIMIT,
              ],
            },
          },
        },
      ])
      .toArray()

    return response
  }

  async getMyReviews(payload: { userId: string; cursor?: string }) {
    const { userId, cursor } = payload

    const [response] = await databaseService.reviews
      .aggregate<{
        data: Omit<AggregatedReviewType, 'user'>[]
        hasNextPage: boolean
      }>([
        {
          $match: {
            userId: new ObjectId(userId),
            ...(cursor
              ? {
                  _id: {
                    $lt: new ObjectId(cursor),
                  },
                }
              : {}),
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
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $limit: REVIEW_PAGE_LIMIT + 1,
              },
            ],
          },
        },
        {
          $project: {
            data: {
              $slice: ['$data', REVIEW_PAGE_LIMIT],
            },
            hasNextPage: {
              $gt: [
                {
                  $size: '$data',
                },
                REVIEW_PAGE_LIMIT,
              ],
            },
          },
        },
      ])
      .toArray()

    return response
  }

  async deleteReview({ reviewId, userId }: { reviewId: string; userId: string }) {
    // Phải deleteOne theo _id và userId
    // Vì để tránh trường hợp người dùng xóa review của người khác
    const result = await databaseService.reviews.deleteOne({
      _id: new ObjectId(reviewId),
      userId: new ObjectId(userId),
    })

    if (result.deletedCount === 0) {
      throw new ErrorWithStatus({
        message: 'Review not found or does not belong to you.',
        statusCode: HttpStatusCode.NotFound,
      })
    }
  }
}

const reviewsService = new ReviewsService()
export default reviewsService
