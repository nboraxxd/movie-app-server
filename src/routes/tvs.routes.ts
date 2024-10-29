import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { zodValidator } from '@/middlewares/validators.middleware'
import { pageQuerySchema, searchQuerySchema } from '@/schemas/common-media.schema'
import { discoverTvsQuerySchema, getTvDetailParamsSchema } from '@/schemas/tv.schema'
import {
  discoverTvsController,
  getRecommendedTvsController,
  getTvDetailController,
  searchTvsController,
  topRatedTvsController,
} from '@/controllers/tvs.controllers'

const tvsRouter = Router()

/**
 * @swagger
 * /tvs/discover:
 *  get:
 *   tags:
 *   - tvs
 *   summary: Get discover tvs
 *   description: Get discover tvs by query parameters
 *   operationId: discoverTvs
 *   parameters:
 *    - in: query
 *      name: page
 *      required: false
 *      description: Page number of discover list. If not provided, page 1 will be used.
 *      schema:
 *       type: integer
 *       nullable: true
 *       example: null
 *    - in: query
 *      name: includeAdult
 *      required: false
 *      description: Include adult content.
 *      schema:
 *       type: boolean
 *       example: null
 *    - in: query
 *      name: voteAverageGte
 *      required: false
 *      description: Vote average greater than or equal to value.
 *      schema:
 *       type: number
 *       format: float
 *       example: null
 *    - in: query
 *      name: voteAverageLte
 *      required: false
 *      description: Vote average less than or equal to value.
 *      schema:
 *       type: number
 *       format: float
 *       example: null
 *    - in: query
 *      name: withGenres
 *      required: false
 *      description: Filter tvs by genres.
 *      schema:
 *       type: string
 *       pattern: '^(\d+)(,\d+)*$'
 *       example: 28,12,16
 *    - in: query
 *      name: sortBy
 *      required: false
 *      description: Sort by field.
 *      schema:
 *       type: string
 *       enum:
 *       - original_title.asc
 *       - original_title.desc
 *       - popularity.asc
 *       - popularity.desc
 *       - revenue.asc
 *       - revenue.desc
 *       - primary_release_date.asc
 *       - primary_release_date.desc
 *       - title.asc
 *       - title.desc
 *       - vote_average.asc
 *       - vote_average.desc
 *       - vote_count.asc
 *       - vote_count.desc
 *       example: popularity.desc
 *   responses:
 *    '200':
 *     description: Get discover tv list successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get discover tv list successful
 *         data:
 *          $ref: '#/components/schemas/dataDiscoverTvsResponseSchema'
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
tvsRouter.get(
  '/discover',
  zodValidator(discoverTvsQuerySchema, { location: 'query' }),
  wrapRequestHandler(discoverTvsController)
)

/**
 * @swagger
 * /tvs/top-rated:
 *  get:
 *   tags:
 *   - tvs
 *   summary: Get top rated tvs
 *   description: Get top rated tvs with page number
 *   operationId: topRatedTvs
 *   parameters:
 *    - in: query
 *      name: page
 *      required: false
 *      description: Page number of top rated tv list. If not provided, page 1 will be used.
 *      schema:
 *       type: integer
 *       example: null
 *   responses:
 *    '200':
 *     description: Get top rated tv list successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get top rated tv list successful
 *         data:
 *          $ref: '#/components/schemas/dataTopRatedTvsResponseSchema'
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
tvsRouter.get(
  '/top-rated',
  zodValidator(pageQuerySchema, { location: 'query' }),
  wrapRequestHandler(topRatedTvsController)
)

/**
 * @swagger
 * /tvs/search:
 *  get:
 *   tags:
 *   - tvs
 *   summary: Search tvs
 *   description: Search tvs by query parameters
 *   operationId: searchTvs
 *   parameters:
 *    - in: query
 *      name: query
 *      required: true
 *      description: Search query.
 *      schema:
 *       type: string
 *       example: 'Breaking Bad'
 *    - in: query
 *      name: page
 *      required: false
 *      description: Page number of search list. If not provided, page 1 will be used.
 *      schema:
 *       type: integer
 *       example: null
 *   responses:
 *    '200':
 *     description: Get search tv list successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get search tv list successful
 *         data:
 *          $ref: '#/components/schemas/dataSearchTvsResponseSchema'
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
tvsRouter.get(
  '/search',
  zodValidator(searchQuerySchema, { location: 'query' }),
  wrapRequestHandler(searchTvsController)
)

/**
 * @swagger
 * /tv/{tvId}:
 *  get:
 *   tags:
 *   - tvs
 *   summary: Get tv detail
 *   description: Get tv detail by tv ID
 *   operationId: tvDetail
 *   parameters:
 *    - in: path
 *      name: tvId
 *      required: true
 *      description: Tv ID.
 *      schema:
 *       type: string
 *       example: 1396
 *   responses:
 *    '200':
 *     description: Get tv detail successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get tv detail successful
 *         data:
 *          $ref: '#/components/schemas/tvDetailDataSchema'
 *    '400':
 *     description: Bad request
 */
tvsRouter.get(
  '/:tvId',
  zodValidator(getTvDetailParamsSchema, { location: 'params' }),
  wrapRequestHandler(getTvDetailController)
)

/**
 * @swagger
 * /tvs/{tvId}/recommended:
 *  get:
 *   tags:
 *   - tvs
 *   summary: Get recommended
 *   description: Get recommended by tv ID
 *   operationId: recommendedTvs
 *   parameters:
 *    - in: path
 *      name: tvId
 *      required: true
 *      description: Tv ID.
 *      schema:
 *       type: string
 *       example: 1396
 *   responses:
 *    '200':
 *     description: Get recommended successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get recommended successful
 *         data:
 *          $ref: '#/components/schemas/dataRecommendedResponseSchema'
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
tvsRouter.get(
  '/:tvId/recommended',
  zodValidator(getTvDetailParamsSchema, { location: 'params' }),
  wrapRequestHandler(getRecommendedTvsController)
)

export default tvsRouter
