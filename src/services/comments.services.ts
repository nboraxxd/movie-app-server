import omit from 'lodash/omit'
import { ObjectId } from 'mongodb'

import { HttpStatusCode } from '@/constants/http-status-code'
import Comment from '@/models/comment.model'
import { ErrorWithStatus } from '@/models/errors'
import databaseService from '@/services/database.services'
import { AddCommentBodyType, AddCommentResponseType } from '@/schemas/comments.schema'

class CommentsService {
  async addComment(
    payload: AddCommentBodyType & { userId: string }
  ): Promise<Omit<AddCommentResponseType, 'message'>['data']> {
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

    const [newComment, user] = await Promise.all([
      databaseService.comments.findOne({ _id: result.insertedId }),
      databaseService.users.findOne(
        { _id: new ObjectId(userId) },
        {
          projection: { forgotPasswordToken: 0, password: 0 },
        }
      ),
    ])

    if (!newComment || !user) {
      throw new ErrorWithStatus({
        message: 'Add comment failed',
        statusCode: HttpStatusCode.BadRequest,
        errorInfo: { mediaId, userId },
      })
    }

    return {
      ...omit(newComment, ['userId']),
      _id: newComment._id.toHexString(),
      user: {
        ...omit(user, ['emailVerifyToken']),
        _id: user._id.toHexString(),
        isVerified: user.emailVerifyToken === null,
      },
    }
  }
}

const commentsService = new CommentsService()
export default commentsService
