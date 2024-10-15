import { Router } from 'express'

import authService from '@/services/auth.services'
import { wrapRequestHandler } from '@/utils/handlers'
import { addFavoriteBodySchema, getFavoritesQuery } from '@/schemas/favorite.schema'
import { authorizationValidator, zodValidator } from '@/middlewares/validators.middleware'
import { addFavoriteController, getMyFavoritesController } from '@/controllers/favorites.controllers'

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
  authorizationValidator({ isLoginRequired: true, customHandler: authService.ensureUserExistsAndVerify }),
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
 *      name: page
 *      required: false
 *      description: Page number of favorite list. If not provided, default is 1.
 *      schema:
 *       type: integer
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
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
favoritesRouter.get(
  '/me',
  authorizationValidator({ isLoginRequired: true }),
  zodValidator(getFavoritesQuery, { location: 'query' }),
  wrapRequestHandler(getMyFavoritesController)
)

export default favoritesRouter
