import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { zodValidator } from '@/middlewares/validators.middleware'
import { getMovieDetailParamsSchema } from '@/schemas/tmdb-movies.schema'
import {
  discoverQuerySchema,
  topRatedQuerySchema,
  trendingParamsSchema,
  trendingQuerySchema,
} from '@/schemas/tmdb.schema'
import { trendingController } from '@/controllers/tmdb.controllers'
import {
  discoverMoviesController,
  getMovieDetailController,
  getRecommendedMoviesController,
  topRatedMoviesController,
} from '@/controllers/tmdb-movies.controllers'

const tmdbRouter = Router()

/**
 * @swagger
 * /trending/{trendingType}/{timeWindow}:
 *  get:
 *   tags:
 *   - trending
 *   summary: Get trending list
 *   description: Get trending list of movies and TV shows by time window
 *   operationId: trending
 *   parameters:
 *    - in: path
 *      name: trendingType
 *      required: false
 *      description: Type of trending list (all, movie, tv). Default is all.
 *      schema:
 *       type: string
 *       example: all
 *    - in: path
 *      name: timeWindow
 *      required: false
 *      description: Time window of trending list (day, week). Default is day.
 *      schema:
 *       type: string
 *       example: day
 *    - in: query
 *      name: page
 *      required: false
 *      description: Page number of trending list. Default is 1.
 *      schema:
 *       type: integer
 *       example: 1
 *   responses:
 *    '200':
 *     description: Get trending list successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get trending list successfully.
 *         data:
 *          $ref: '#/components/schemas/authResponseSchema'
 *        pagination:
 *          $ref: '#/components/schemas/paginationSchema'
 *    '422':
 *     description: Invalid value or missing field
 */
tmdbRouter.get(
  '/trending/:trendingType?/:timeWindow?',
  zodValidator({ schema: trendingParamsSchema, location: 'params' }),
  zodValidator({ schema: trendingQuerySchema, location: 'query' }),
  wrapRequestHandler(trendingController)
)

tmdbRouter.get(
  '/movies/discover',
  zodValidator({ schema: discoverQuerySchema, location: 'query' }),
  wrapRequestHandler(discoverMoviesController)
)

tmdbRouter.get(
  '/movies/top-rated',
  zodValidator({ schema: topRatedQuerySchema, location: 'query' }),
  wrapRequestHandler(topRatedMoviesController)
)

tmdbRouter.get(
  '/movies/:movieId',
  zodValidator({ schema: getMovieDetailParamsSchema, location: 'params' }),
  wrapRequestHandler(getMovieDetailController)
)

tmdbRouter.get(
  '/movies/:movieId/recommended',
  zodValidator({ schema: getMovieDetailParamsSchema, location: 'params' }),
  wrapRequestHandler(getRecommendedMoviesController)
)

export default tmdbRouter
