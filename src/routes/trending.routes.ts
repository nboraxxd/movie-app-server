import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { trendingController } from '@/controllers/trending.controllers'
import { zodValidator } from '@/middlewares/validators.middleware'
import { pageQuerySchema } from '@/schemas/common-media.schema'
import { trendingParamsSchema } from '@/schemas/trending.shema'

const trendingRouter = Router()

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
 *      required: true
 *      description: Type of trending list (all, movie, tv).
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
 *      description: Page number of trending list. If not provided, page 1 will be used.
 *      schema:
 *       type: integer
 *       nullable: true
 *       example: null
 *   responses:
 *    '200':
 *     description: Get trending list successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get trending list successful
 *         data:
 *          $ref: '#/components/schemas/dataTrendingResponseSchema'
 *         pagination:
 *          $ref: '#/components/schemas/paginationResponseSchema'
 *    '400':
 *     description: Bad request
 */
trendingRouter.get(
  '/:trendingType/:timeWindow?',
  zodValidator(trendingParamsSchema, { location: 'params' }),
  zodValidator(pageQuerySchema, { location: 'query' }),
  wrapRequestHandler(trendingController)
)

export default trendingRouter
