import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types/token.type'
import reviewsService from '@/services/reviews.services'
import { MessageResponseType } from '@/schemas/common.schema'
import { PageQueryType } from '@/schemas/common-media.schema'
import {
  AddReviewBodyType,
  AddReviewResponseType,
  GetReviewsByMediaParamsType,
  GetReviewsByMediaResponseType,
  GetMyReviewsResponseType,
  DeleteReviewParamsType,
} from '@/schemas/reviews.schema'

export const addReviewController = async (
  req: Request<ParamsDictionary, any, AddReviewBodyType>,
  res: Response<AddReviewResponseType>
) => {
  const { content, mediaId, mediaPoster, mediaReleaseDate, mediaTitle, mediaType } = req.body

  const { userId } = req.decodedAuthorization as TokenPayload

  const result = await reviewsService.addReview({
    content,
    mediaId,
    mediaPoster,
    mediaReleaseDate,
    mediaTitle,
    mediaType,
    userId,
  })

  return res.json({
    message: 'Review added successful',
    data: {
      ...result,
      userId: result.userId.toHexString(),
      _id: result._id.toHexString(),
    },
  })
}

export const getReviewsByMediaController = async (
  req: Request<GetReviewsByMediaParamsType, any, any, PageQueryType>,
  res: Response<GetReviewsByMediaResponseType>
) => {
  const { mediaId, mediaType } = req.params
  const { page } = req.query

  const result = await reviewsService.getReviewsByMedia({ mediaId, mediaType, page })

  return res.json({
    message: 'Get reviews successful',
    data: result.data.map((review) => ({
      ...review,
      _id: review._id.toHexString(),
      user: {
        ...review.user,
        _id: review.user._id.toHexString(),
      },
    })),
    pagination: result.pagination,
  })
}

export const getMyReviewsController = async (
  req: Request<ParamsDictionary, any, any, PageQueryType>,
  res: Response<GetMyReviewsResponseType>
) => {
  const { page } = req.query
  const { userId } = req.decodedAuthorization as TokenPayload

  const result = await reviewsService.getMyReviews({ userId, page })

  return res.json({
    message: 'Get reviews successful',
    data: result.data.map((review) => ({
      ...review,
      _id: review._id.toHexString(),
    })),
    pagination: result.pagination,
  })
}

export const deleteReviewController = async (
  req: Request<DeleteReviewParamsType>,
  res: Response<MessageResponseType>
) => {
  const { reviewId } = req.params
  const { userId } = req.decodedAuthorization as TokenPayload

  await reviewsService.deleteReview({ reviewId, userId })

  return res.json({ message: 'Delete review successful' })
}
