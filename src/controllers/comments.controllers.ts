import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types/token.type'
import commentsService from '@/services/comments.services'
import { MessageResponseType } from '@/schemas/common.schema'
import { PageQueryType } from '@/schemas/common-media.schema'
import {
  AddCommentBodyType,
  AddCommentResponseType,
  GetCommentsByMediaParamsType,
  GetCommentsByMediaResponseType,
  GetMyCommentsResponseType,
  DeleteCommentParamsType,
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
  req: Request<GetCommentsByMediaParamsType, any, any, PageQueryType>,
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

export const getMyCommentsController = async (
  req: Request<ParamsDictionary, any, any, PageQueryType>,
  res: Response<GetMyCommentsResponseType>
) => {
  const { page } = req.query
  const { userId } = req.decodedAuthorization as TokenPayload

  const result = await commentsService.getMyComments({ userId, page })

  return res.json({
    message: 'Get comments successful',
    data: result.data.map((comment) => ({
      ...comment,
      _id: comment._id.toHexString(),
    })),
    pagination: result.pagination,
  })
}

export const deleteCommentController = async (
  req: Request<DeleteCommentParamsType>,
  res: Response<MessageResponseType>
) => {
  const { commentId } = req.params
  const { userId } = req.decodedAuthorization as TokenPayload

  await commentsService.deleteComment({ commentId, userId })

  return res.json({ message: 'Delete comment successful' })
}
