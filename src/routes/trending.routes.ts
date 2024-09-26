import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { trendingParamsSchema, trendingQuerySchema } from '@/schemas/trending.schema'
import { zodValidator } from '@/middlewares/validators.middleware'
import { trendingController } from '@/controllers/trending.controllers'

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
trendingRouter.get(
  '/:trendingType?/:timeWindow?',
  zodValidator(trendingParamsSchema, 'params'),
  zodValidator(trendingQuerySchema, 'query'),
  wrapRequestHandler(trendingController)
)

export default trendingRouter
