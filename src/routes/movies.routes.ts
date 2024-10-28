import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { zodValidator } from '@/middlewares/validators.middleware'
import { searchQuerySchema, topRatedQuerySchema } from '@/schemas/common-media.schema'
import { discoverMoviesQuerySchema, getMovieDetailParamsSchema } from '@/schemas/movies.schema'
import {
  discoverMoviesController,
  getMovieDetailController,
  getRecommendedMoviesController,
  searchMoviesController,
  topRatedMoviesController,
} from '@/controllers/movies.controllers'

const moviesRouter = Router()

/**
 * @swagger
 * /movies/discover:
 *  get:
 *   tags:
 *   - movies
 *   summary: Get discover movies
 *   description: Get discover movies by query parameters
 *   operationId: discoverMovies
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
 *      name: includeVideo
 *      required: false
 *      description: Include video content.
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
 *      description: Filter movies by genres.
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
 *     description: Get discover movie list successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get discover movie list successful
 *         data:
 *          $ref: '#/components/schemas/dataDiscoverMoviesResponseSchema'
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
moviesRouter.get(
  '/discover',
  zodValidator(discoverMoviesQuerySchema, { location: 'query' }),
  wrapRequestHandler(discoverMoviesController)
)

/**
 * @swagger
 * /movies/top-rated:
 *  get:
 *   tags:
 *   - movies
 *   summary: Get top rated movies
 *   description: Get top rated movies with page number
 *   operationId: topRatedMovies
 *   parameters:
 *    - in: query
 *      name: page
 *      required: false
 *      description: Page number of top rated list. If not provided, page 1 will be used.
 *      schema:
 *       type: integer
 *       example: null
 *   responses:
 *    '200':
 *     description: Get top rated movie list successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get top rated movie list successful
 *         data:
 *          $ref: '#/components/schemas/dataTopRatedMoviesResponseSchema'
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
moviesRouter.get(
  '/top-rated',
  zodValidator(topRatedQuerySchema, { location: 'query' }),
  wrapRequestHandler(topRatedMoviesController)
)

/**
 * @swagger
 * /movies/search:
 *  get:
 *   tags:
 *   - movies
 *   summary: Search movies
 *   description: Search movies by query parameters
 *   operationId: searchMovies
 *   parameters:
 *    - in: query
 *      name: query
 *      required: true
 *      description: Search query.
 *      schema:
 *       type: string
 *       example: The Avengers
 *    - in: query
 *      name: page
 *      required: false
 *      description: Page number of search list. If not provided, page 1 will be used.
 *      schema:
 *       type: integer
 *       example: null
 *   responses:
 *    '200':
 *     description: Get search movie list successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get search movie list successful
 *         data:
 *          $ref: '#/components/schemas/dataSearchMoviesResponseSchema'
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
moviesRouter.get(
  '/search',
  zodValidator(searchQuerySchema, { location: 'query' }),
  wrapRequestHandler(searchMoviesController)
)

/**
 * @swagger
 * /movies/{movieId}:
 *  get:
 *   tags:
 *   - movies
 *   summary: Get movie detail
 *   description: Get movie detail by movie ID
 *   operationId: movieDetail
 *   parameters:
 *    - in: path
 *      name: movieId
 *      required: true
 *      description: Movie ID.
 *      schema:
 *       type: string
 *       example: 155
 *   responses:
 *    '200':
 *     description: Get movie detail successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get movie detail successful
 *         data:
 *          $ref: '#/components/schemas/movieDetailDataSchema'
 *    '400':
 *     description: Bad request
 *    '404':
 *     description: The resource you requested could not be found.
 */
moviesRouter.get(
  '/:movieId',
  zodValidator(getMovieDetailParamsSchema, { location: 'params' }),
  wrapRequestHandler(getMovieDetailController)
)

/**
 * @swagger
 * /movies/{movieId}/recommended:
 *  get:
 *   tags:
 *   - movies
 *   summary: Get recommended
 *   description: Get recommended by movie ID
 *   operationId: recommendedMovies
 *   parameters:
 *    - in: path
 *      name: movieId
 *      required: true
 *      description: Movie ID.
 *      schema:
 *       type: string
 *       example: 155
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
moviesRouter.get(
  '/:movieId/recommended',
  zodValidator(getMovieDetailParamsSchema, { location: 'params' }),
  wrapRequestHandler(getRecommendedMoviesController)
)

export default moviesRouter
