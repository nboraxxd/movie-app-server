import { Router } from 'express'

import authService from '@/services/auth.services'
import { wrapRequestHandler } from '@/utils/handlers'
import { authorizationValidator, zodValidator } from '@/middlewares/validators.middleware'
import {
  addCommentBodySchema,
  deleteCommentParams,
  getCommentsByMediaParams,
  getCommentsQuery,
} from '@/schemas/comments.schema'
import {
  addCommentController,
  deleteCommentController,
  getCommentsByMediaController,
  getMyCommentsController,
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
 *   security:
 *    - bearerAuth: []
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
  authorizationValidator({ isLoginRequired: true, customHandler: authService.ensureUserExistsAndVerify }),
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
 * /comments/me:
 *  get:
 *   tags:
 *   - comments
 *   summary: Get my comments
 *   description: Get all comments of current user with query parameters
 *   operationId: getCommentsByUserId
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: query
 *      name: page
 *      required: false
 *      description: Page number of comment list. If not provided, page 1 will be used.
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
  '/me',
  authorizationValidator({ isLoginRequired: true }),
  zodValidator(getCommentsQuery, { location: 'query' }),
  wrapRequestHandler(getMyCommentsController)
)

/**
 * @swagger
 * /comments/{commentId}:
 *  delete:
 *   tags:
 *   - comments
 *   summary: Delete comment
 *   description: Delete comment by comment id
 *   operationId: deleteComment
 *   parameters:
 *    - in: path
 *      name: commentId
 *      required: true
 *      description: Comment id need to delete.
 *      schema:
 *       type: string
 *       example: 123abc...
 *   responses:
 *    '200':
 *     description: Delete comment successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Delete comment successful
 *    '400':
 *     description: Missing or invalid comment id
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: Comment not found
 */
commentsRouter.delete(
  '/:commentId',
  authorizationValidator({ isLoginRequired: true, customHandler: authService.ensureUserExistsAndVerify }),
  zodValidator(deleteCommentParams, { location: 'params' }),
  wrapRequestHandler(deleteCommentController)
)

export default commentsRouter
