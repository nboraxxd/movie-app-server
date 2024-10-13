import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types/token.type'
import commentsService from '@/services/comments.services'
import { AddCommentBodyType, AddCommentResponseType } from '@/schemas/comments.schema'

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
    data: result,
  })
}
