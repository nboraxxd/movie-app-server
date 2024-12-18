import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import {
  addFavoriteBodySchema,
  deleteFavoriteByIdParamsSchema,
  favoriteByMediaParamsSchema,
} from '@/schemas/favorite.schema'
import { cursorPageQuerySchema } from '@/schemas/common-media.schema'
import { authorizationValidator, zodValidator } from '@/middlewares/validators.middleware'
import {
  addFavoriteController,
  checkIsFavoriteByMediaController,
  deleteFavoriteByIdController,
  deleteFavoriteByMediaController,
  getMyFavoritesController,
} from '@/controllers/favorites.controllers'

const favoritesRouter = Router()

/**
 * @swagger
 * /favorites:
 *  post:
 *   tags:
 *   - favorites
 *   summary: Add favorite
 *   description: Add favorite media with media id, media title, media type, media poster and media release date
 *   operationId: addFavorite
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    description: Favorite information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/addFavoriteBodySchema'
 *   responses:
 *    '200':
 *     description: Favorite added successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Favorite added successful
 *         data:
 *          allOf:
 *          - $ref: '#/components/schemas/favoriteDataResponseSchema'
 *          - type: object
 *            properties:
 *             userId:
 *              type: string
 *              example: 123abc...
 *    '400':
 *     description: Bad request
 */
favoritesRouter.post(
  '/',
  authorizationValidator({ isLoginRequired: true, ensureUserExistsAndVerify: true }),
  zodValidator(addFavoriteBodySchema, { location: 'body' }),
  wrapRequestHandler(addFavoriteController)
)

/**
 * @swagger
 * /favorites/me:
 *  get:
 *   tags:
 *   - favorites
 *   summary: Get my favorites
 *   description: Get all favorites of current user with query params
 *   operationId: getMyFavorites
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
 *     description: Get favorites successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get favorites successful
 *         data:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/favoriteDataResponseSchema'
 *         hasNextPage:
 *          type: boolean
 *          example: true
 *    '400':
 *     description: Bad request
 */
favoritesRouter.get(
  '/me',
  authorizationValidator({ isLoginRequired: true, ensureUserExists: true }),
  zodValidator(cursorPageQuerySchema, { location: 'query' }),
  wrapRequestHandler(getMyFavoritesController)
)

/**
 * @swagger
 * /favorites/{favoriteId}:
 *  delete:
 *   tags:
 *   - favorites
 *   summary: Delete favorite by id
 *   description: Delete favorite by favorite id
 *   operationId: deleteFavoriteById
 *   parameters:
 *    - in: path
 *      name: favoriteId
 *      required: true
 *      description: Favorite id to delete.
 *      schema:
 *       type: string
 *       example: 123abc...
 *   responses:
 *    '200':
 *     description: Delete favorite by id successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Delete favorite by id successful
 *    '400':
 *     description: Missing or invalid params
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: Favorite not found
 */
favoritesRouter.delete(
  '/:favoriteId',
  authorizationValidator({ isLoginRequired: true, ensureUserExistsAndVerify: true }),
  zodValidator(deleteFavoriteByIdParamsSchema, { location: 'params' }),
  wrapRequestHandler(deleteFavoriteByIdController)
)

/**
 * @swagger
 * /favorites/medias/check/{mediaId}/{mediaType}:
 *  get:
 *   tags:
 *   - favorites
 *   summary: Check favorite by media
 *   description: Check media is favorite by media id and media type
 *   operationId: checkIsFavoriteByMedia
 *   parameters:
 *    - in: path
 *      name: mediaId
 *      required: true
 *      description: Media id to check favorite.
 *      schema:
 *       type: string
 *       example: 155
 *    - in: path
 *      name: mediaType
 *      required: true
 *      description: Media type to check favorite.
 *      schema:
 *       type: string
 *       enum: ['movie', 'tv']
 *       example: movie
 *   responses:
 *    '200':
 *     description: Check favorite by media successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Check favorite by media successful
 *         data:
 *          type: object
 *          properties:
 *           isFavorite:
 *            type: boolean
 *            example: true
 *    '400':
 *     description: Missing or invalid params
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: User not found
 */
favoritesRouter.get(
  '/medias/check/:mediaId/:mediaType',
  authorizationValidator({ isLoginRequired: true, ensureUserExists: true }),
  zodValidator(favoriteByMediaParamsSchema, { location: 'params' }),
  wrapRequestHandler(checkIsFavoriteByMediaController)
)

/**
 * @swagger
 * /favorites/medias/{mediaId}/{mediaType}:
 *  delete:
 *   tags:
 *   - favorites
 *   summary: Delete favorite by media
 *   description: Delete favorite by media id and media type
 *   operationId: deleteFavoriteByMedia
 *   parameters:
 *    - in: path
 *      name: mediaId
 *      required: true
 *      description: Media id to delete favorite.
 *      schema:
 *       type: string
 *       example: 155
 *    - in: path
 *      name: mediaType
 *      required: true
 *      description: Media type to delete favorite.
 *      schema:
 *       type: string
 *       enum: ['movie', 'tv']
 *       example: movie
 *   responses:
 *    '200':
 *     description: Delete favorite by media successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Delete favorite by media successful
 *    '400':
 *     description: Missing or invalid params
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: Favorite not found
 */
favoritesRouter.delete(
  '/medias/:mediaId/:mediaType',
  authorizationValidator({ isLoginRequired: true, ensureUserExistsAndVerify: true }),
  zodValidator(favoriteByMediaParamsSchema, { location: 'params' }),
  wrapRequestHandler(deleteFavoriteByMediaController)
)

export default favoritesRouter
