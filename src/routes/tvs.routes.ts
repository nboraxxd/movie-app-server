import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { zodValidator } from '@/middlewares/validators.middleware'
import { topRatedQuerySchema } from '@/schemas/common-media.schema'
import { topRatedTvsController } from '@/controllers/tvs.controllers'

const tvsRouter = Router()

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
  zodValidator({ schema: topRatedQuerySchema, location: 'query' }),
  wrapRequestHandler(topRatedTvsController)
)

export default tvsRouter
