import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { authorizationValidator, zodValidator } from '@/middlewares/validators.middleware'
import { cursorPageQuerySchema, pageQuerySchema } from '@/schemas/common-media.schema'
import { addReviewBodySchema, deleteReviewParamsSchema, getReviewsByMediaParams } from '@/schemas/reviews.schema'
import {
  addReviewController,
  deleteReviewController,
  getReviewsByMediaController,
  getMyReviewsController,
} from '@/controllers/reviews.controllers'

const reviewsRouter = Router()

/**
 * @swagger
 * /reviews:
 *  post:
 *   tags:
 *   - reviews
 *   summary: Add review
 *   description: Add review with media id, media title, media type, media poster, media release date and content
 *   operationId: addReview
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    description: Review information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/addReviewBodySchema'
 *   responses:
 *    '200':
 *     description: Review added successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Review added successful
 *         data:
 *          $ref: '#/components/schemas/reviewExtendDataResponseSchema'
 *    '400':
 *     description: Bad request
 */
reviewsRouter.post(
  '/',
  authorizationValidator({ isLoginRequired: true, ensureUserExistsAndVerify: true }),
  zodValidator(addReviewBodySchema, { location: 'body' }),
  wrapRequestHandler(addReviewController)
)

/**
 * @swagger
 * /reviews/medias/{mediaId}/{mediaType}:
 *  get:
 *   tags:
 *   - reviews
 *   summary: Get reviews by media
 *   description: Get reviews by media id and media type with query parameters
 *   operationId: getReviewsByMedia
 *   parameters:
 *    - in: path
 *      name: mediaId
 *      required: true
 *      description: Media id need to get reviews.
 *      schema:
 *       type: string
 *       example: 533535
 *    - in: path
 *      name: mediaType
 *      required: true
 *      description: Media type of media id (movie, tv).
 *      schema:
 *       type: string
 *       enum: [movie, tv]
 *       example: movie
 *    - in: query
 *      name: cursor
 *      required: false
 *      description: _id of last item in current page. If not provided, get first page.
 *      schema:
 *       type: string
 *       nullable: true
 *       example: null
 *   responses:
 *    '200':
 *     description: Get reviews successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get reviews successful
 *         data:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/reviewExtendDataResponseSchema'
 *         hasNextPage:
 *          type: boolean
 *          example: true
 *    '400':
 *     description: Bad request
 */
reviewsRouter.get(
  '/medias/:mediaId/:mediaType',
  zodValidator(getReviewsByMediaParams, { location: 'params' }),
  zodValidator(cursorPageQuerySchema, { location: 'query' }),
  wrapRequestHandler(getReviewsByMediaController)
)

/**
 * @swagger
 * /reviews/me:
 *  get:
 *   tags:
 *   - reviews
 *   summary: Get my reviews
 *   description: Get all reviews of current user with query parameters
 *   operationId: getReviewsByUserId
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: query
 *      name: cursor
 *      required: true
 *      description: _id of last item in current page. If not provided, get first page.
 *      schema:
 *       type: string
 *       nullable: true
 *       example: null
 *   responses:
 *    '200':
 *     description: Get reviews successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get reviews successful
 *         data:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/reviewDataResponseSchema'
 *         hasNextPage:
 *          type: boolean
 *          example: true
 *    '400':
 *     description: Bad request
 */
reviewsRouter.get(
  '/me',
  authorizationValidator({ isLoginRequired: true }),
  zodValidator(pageQuerySchema, { location: 'query' }),
  wrapRequestHandler(getMyReviewsController)
)

/**
 * @swagger
 * /reviews/{reviewId}:
 *  delete:
 *   tags:
 *   - reviews
 *   summary: Delete review
 *   description: Delete review by review id
 *   operationId: deleteReview
 *   parameters:
 *    - in: path
 *      name: reviewId
 *      required: true
 *      description: Review id need to delete.
 *      schema:
 *       type: string
 *       example: 123abc...
 *   responses:
 *    '200':
 *     description: Delete review successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Delete review successful
 *    '400':
 *     description: Missing or invalid review id
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: Review not found
 */
reviewsRouter.delete(
  '/:reviewId',
  authorizationValidator({ isLoginRequired: true, ensureUserExistsAndVerify: true }),
  zodValidator(deleteReviewParamsSchema, { location: 'params' }),
  wrapRequestHandler(deleteReviewController)
)

export default reviewsRouter
