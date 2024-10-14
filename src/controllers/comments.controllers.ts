import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types/token.type'
import commentsService from '@/services/comments.services'
import {
  AddCommentBodyType,
  AddCommentResponseType,
  GetCommentsByMediaParamsType,
  GetCommentsQueryType,
  GetCommentsByMediaResponseType,
  GetCommentsByUserIdParamsType,
  GetCommentsByUserIdResponseType,
} from '@/schemas/comments.schema'

export const addCommentController = async (
  req: Request<ParamsDictionary, any, AddCommentBodyType>,
  res: Response<AddCommentResponseType>
) => {
  const { content, mediaId, mediaPoster, mediaReleaseDate, mediaTitle, mediaType } = req.body

  const { userId } = req.decodedAuthorization as TokenPayload

  const result = await commentsService.addComment({
    content,
    mediaId,
    mediaPoster,
    mediaReleaseDate,
    mediaTitle,
    mediaType,
    userId,
  })

  return res.json({
    message: 'Comment added successful',
    data: {
      ...result,
      _id: result._id.toHexString(),
      user: {
        ...result.user,
        _id: result.user._id.toHexString(),
      },
    },
  })
}

export const getCommentsByMediaController = async (
  req: Request<GetCommentsByMediaParamsType, any, any, GetCommentsQueryType>,
  res: Response<GetCommentsByMediaResponseType>
) => {
  const { mediaId, mediaType } = req.params
  const { page } = req.query

  const result = await commentsService.getCommentsByMedia({ mediaId, mediaType, page })

  return res.json({
    message: 'Get comments successful',
    data: result.data.map((comment) => ({
      ...comment,
      _id: comment._id.toHexString(),
      user: {
        ...comment.user,
        _id: comment.user._id.toHexString(),
      },
    })),
    pagination: result.pagination,
  })
}

export const getCommentsByUserIdController = async (
  req: Request<GetCommentsByUserIdParamsType, any, any, GetCommentsQueryType>,
  res: Response<GetCommentsByUserIdResponseType>
) => {
  const { userId } = req.params
  const { page } = req.query

  const result = await commentsService.getCommentsByUserId({ userId, page })

  return res.json({
    message: 'Get comments successful',
    data: result.data.map((comment) => ({
      ...comment,
      _id: comment._id.toHexString(),
    })),
    pagination: result.pagination,
  })
}
