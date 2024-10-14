import { Router } from 'express'

import authService from '@/services/auth.services'
import { wrapRequestHandler } from '@/utils/handlers'
import { authorizationValidator, zodValidator } from '@/middlewares/validators.middleware'
import {
  addCommentBodySchema,
  getCommentsByMediaParams,
  getCommentsByUserIdParams,
  getCommentsQuery,
} from '@/schemas/comments.schema'
import {
  addCommentController,
  getCommentsByMediaController,
  getCommentsByUserIdController,
} from '@/controllers/comments.controllers'

const commentsRouter = Router()

/**
 * @swagger
 * /comments:
 *  post:
 *   tags:
 *   - comments
 *   summary: Add comment
 *   description: Add comment with media id, media title, media type, media poster, media release date and content
 *   operationId: addComment
 *   requestBody:
 *    description: Comment information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/addCommentBodySchema'
 *   responses:
 *    '200':
 *     description: Comment added successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Comment added successful
 *         data:
 *          $ref: '#/components/schemas/commentExtendDataResponseSchema'
 *    '400':
 *     description: Bad request
 */
commentsRouter.post(
  '/',
  authorizationValidator({ isLoginRequired: true, customHandler: authService.checkUserVerification }),
  zodValidator(addCommentBodySchema, { location: 'body' }),
  wrapRequestHandler(addCommentController)
)

/**
 * @swagger
 * /comments/medias/{mediaId}/{mediaType}:
 *  get:
 *   tags:
 *   - comments
 *   summary: Get comments by media
 *   description: Get comments by media id and media type with query parameters
 *   operationId: getCommentsByMedia
 *   parameters:
 *    - in: path
 *      name: mediaId
 *      required: true
 *      description: Media id need to get comments.
 *      schema:
 *       type: string
 *       example: 533535
 *    - in: path
 *      name: mediaType
 *      required: true
 *      description: Media type of media id (movie, tv).
 *      schema:
 *       type: string
 *       example: movie
 *    - in: query
 *      name: page
 *      required: false
 *      description: Page number of comments list. If not provided, page 1 will be used.
 *      schema:
 *       type: integer
 *       nullable: true
 *       example: null
 *   responses:
 *    '200':
 *     description: Get comments successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get comments successful
 *         data:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/commentExtendDataResponseSchema'
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
commentsRouter.get(
  '/medias/:mediaId/:mediaType',
  zodValidator(getCommentsByMediaParams, { location: 'params' }),
  zodValidator(getCommentsQuery, { location: 'query' }),
  wrapRequestHandler(getCommentsByMediaController)
)

/**
 * @swagger
 * /comments/users/{userId}:
 *  get:
 *   tags:
 *   - comments
 *   summary: Get comments by user id
 *   description: Get comments by user id with query parameters
 *   operationId: getCommentsByUserId
 *   parameters:
 *    - in: path
 *      name: userId
 *      required: true
 *      description: User id need to get comments.
 *      schema:
 *       type: string
 *       example: 670bc1a292537e068525f9d1
 *    - in: query
 *      name: page
 *      required: false
 *      description: Page number of comments list. If not provided, page 1 will be used.
 *      schema:
 *       type: integer
 *       nullable: true
 *       example: null
 *   responses:
 *    '200':
 *     description: Get comments successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get comments successful
 *         data:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/commentDataResponseSchema'
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
commentsRouter.get(
  '/users/:userId',
  zodValidator(getCommentsByUserIdParams, { location: 'params' }),
  zodValidator(getCommentsQuery, { location: 'query' }),
  wrapRequestHandler(getCommentsByUserIdController)
)

export default commentsRouter
