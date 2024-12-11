import { ObjectId, WithId } from 'mongodb'

import Review from '@/models/review.model'
import { ErrorWithStatus } from '@/models/errors'
import { REVIEW_PAGE_LIMIT } from '@/constants'
import { HttpStatusCode } from '@/constants/http-status-code'
import databaseService from '@/services/database.services'
import { MediaType } from '@/schemas/common-media.schema'
import { PaginationResponseType } from '@/schemas/common.schema'
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

  async getReviewsByMedia(payload: { mediaId: number; mediaType: MediaType; page?: number }) {
    const { mediaId, mediaType, page = 1 } = payload

    const [response] = await databaseService.reviews
      .aggregate<{ data: AggregatedReviewType[]; pagination: PaginationResponseType }>([
        {
          $match: {
            mediaId,
            mediaType,
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
                $skip: (page - 1) * REVIEW_PAGE_LIMIT,
              },
              {
                $limit: REVIEW_PAGE_LIMIT,
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
                    REVIEW_PAGE_LIMIT,
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

  async getMyReviews(payload: { userId: string; page?: number }) {
    const { userId, page = 1 } = payload

    const [response] = await databaseService.reviews
      .aggregate<{
        data: Omit<AggregatedReviewType, 'user'>[]
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
                $skip: (page - 1) * REVIEW_PAGE_LIMIT,
              },
              {
                $limit: REVIEW_PAGE_LIMIT,
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
                    REVIEW_PAGE_LIMIT,
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

  async deleteReview({ reviewId: reviewId, userId }: { reviewId: string; userId: string }) {
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
