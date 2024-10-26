import { ObjectId } from 'mongodb'

import Comment from '@/models/comment.model'
import { ErrorWithStatus } from '@/models/errors'
import { COMMENT_PAGE_LIMIT } from '@/constants'
import { HttpStatusCode } from '@/constants/http-status-code'
import databaseService from '@/services/database.services'
import { MediaType } from '@/schemas/common-media.schema'
import { PaginationResponseType } from '@/schemas/common.schema'
import { AddCommentBodyType, AggregatedCommentType } from '@/schemas/comments.schema'

class CommentsService {
  async addComment(payload: AddCommentBodyType & { userId: string }) {
    const { content, mediaId, mediaPoster, mediaReleaseDate, mediaTitle, mediaType, userId } = payload

    const result = await databaseService.comments.insertOne(
      new Comment({
        content,
        mediaId,
        mediaPoster,
        mediaReleaseDate,
        mediaTitle,
        mediaType,
        userId: new ObjectId(userId),
      })
    )

    const [comment] = await databaseService.comments
      .aggregate<AggregatedCommentType>([
        {
          $match: {
            _id: result.insertedId,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $project: {
            userId: 0,
          },
        },
        {
          $addFields: {
            user: {
              $map: {
                input: '$user',
                as: 'item',
                in: {
                  _id: '$$item._id',
                  name: '$$item.name',
                  email: '$$item.email',
                  isVerified: {
                    $cond: {
                      if: {
                        $eq: ['$$item.emailVerifyToken', null],
                      },
                      then: true,
                      else: false,
                    },
                  },
                  avatar: '$$item.avatar',
                },
              },
            },
          },
        },
        {
          $addFields: {
            user: {
              $arrayElemAt: ['$user', 0],
            },
          },
        },
      ])
      .toArray()

    return comment
  }

  async getCommentsByMedia(payload: { mediaId: number; mediaType: MediaType; page: number }) {
    const { mediaId, mediaType, page } = payload

    const [response] = await databaseService.comments
      .aggregate<{ data: AggregatedCommentType[]; pagination: PaginationResponseType }>([
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
                $skip: (page - 1) * COMMENT_PAGE_LIMIT,
              },
              {
                $limit: COMMENT_PAGE_LIMIT,
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
                    COMMENT_PAGE_LIMIT,
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

  async getMyComments(payload: { userId: string; page: number }) {
    const { userId, page } = payload

    const [response] = await databaseService.comments
      .aggregate<{
        data: Omit<AggregatedCommentType, 'user'>[]
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
                $skip: (page - 1) * COMMENT_PAGE_LIMIT,
              },
              {
                $limit: COMMENT_PAGE_LIMIT,
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
                    COMMENT_PAGE_LIMIT,
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

  async deleteComment({ commentId, userId }: { commentId: string; userId: string }) {
    const result = await databaseService.comments.deleteOne({
      _id: new ObjectId(commentId),
      userId: new ObjectId(userId),
    })

    if (result.deletedCount === 0) {
      throw new ErrorWithStatus({ message: 'Comment not found', statusCode: HttpStatusCode.NotFound })
    }
  }
}

const commentsService = new CommentsService()
export default commentsService
