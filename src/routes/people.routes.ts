import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { zodValidator } from '@/middlewares/validators.middleware'
import { personDetailParamsSchema } from '@/schemas/people.schema'
import { getPersonCombinedCreditsController, getPersonDetailController } from '@/controllers/people.controllers'

const peopleRouter = Router()

/**
 * @swagger
 * /people/{personId}:
 *  get:
 *   tags:
 *   - people
 *   summary: Get person detail
 *   description: Get person detail by person ID
 *   operationId: personDetail
 *   parameters:
 *    - in: path
 *      name: personId
 *      required: true
 *      description: Person ID.
 *      schema:
 *       type: string
 *       example: 6193
 *   responses:
 *    '200':
 *     description: Get person detail successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get person detail successful
 *         data:
 *          type: object
 *          properties:
 *           adult:
 *            type: boolean
 *            example: false
 *           alsoKnownAs:
 *            type: array
 *            items:
 *             type: string
 *            example: ['Leo DiCaprio', 'Leonardo Wilhelm DiCaprio']
 *           biography:
 *            type: string
 *            example: 'Leonardo Wilhelm DiCaprio is an American actor, producer, and environmentalist...'
 *           birthday:
 *            type: string
 *            nullable: true
 *            example: '1974-11-11'
 *           deathday:
 *            type: string
 *            nullable: true
 *            example: null
 *           gender:
 *            type: number
 *            example: 2
 *           homepage:
 *            type: string
 *            nullable: true
 *            example: 'https://leonardodicaprio.com'
 *           id:
 *            type: number
 *            example: 6193
 *           imdbId:
 *            type: string
 *            nullable: true
 *            example: 'nm0000138'
 *           knownForDepartment:
 *            type: string
 *            example: 'Acting'
 *           name:
 *            type: string
 *            example: 'Leonardo DiCaprio'
 *           placeOfBirth:
 *            type: string
 *            nullable: true
 *            example: 'Los Angeles, California, USA'
 *           popularity:
 *            type: number
 *            example: 10.0
 *           profilePath:
 *            type: string
 *            nullable: true
 *            example: 'https://media.themoviedb.org/t/p/w276_and_h350_face/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg'
 *    '400':
 *     description: Bad request
 *    '404':
 *     description: The resource you requested could not be found.
 */
peopleRouter.get(
  '/:personId',
  zodValidator(personDetailParamsSchema, { location: 'params' }),
  wrapRequestHandler(getPersonDetailController)
)

/**
 * @swagger
 * /people/{personId}/combined-credits:
 *  get:
 *   tags:
 *   - people
 *   summary: Get person combined credits
 *   description: Get person combined credits by person ID
 *   operationId: personCombinedCredits
 *   parameters:
 *    - in: path
 *      name: personId
 *      required: true
 *      description: Person ID.
 *      schema:
 *       type: string
 *       example: 6193
 *   responses:
 *    '200':
 *     description: Get person combined credits successful
 *    '400':
 *     description: Bad request
 *    '404':
 *     description: The resource you requested could not be found.
 */
peopleRouter.get(
  '/:personId/combined-credits',
  zodValidator(personDetailParamsSchema, { location: 'params' }),
  wrapRequestHandler(getPersonCombinedCreditsController)
)

export default peopleRouter
