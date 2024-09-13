import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { registerBodySchema } from '@/schemas/user.schema'
import { zodValidator } from '@/middlewares/validators.middleware'
import { registerController } from '@/controllers/users.controllers'
import usersService from '@/services/users.services'

const usersRouter = Router()

/**
 * @swagger
 * /users/register:
 *  post:
 *   tags:
 *   - users
 *   summary: Register a new user
 *   description: Create a new user having name, email, password and confirm password
 *   operationId: register
 *   requestBody:
 *    description: User information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/registerBodySchema'
 *   responses:
 *    '201':
 *     description: Register success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Please check your email to verify your account.
 *         data:
 *          $ref: '#/components/schemas/authResponseSchema'
 *    '422':
 *     description: Invalid value or missing field
 */
usersRouter.post(
  '/register',
  zodValidator(registerBodySchema, 'body', usersService.validateUserRegister),
  wrapRequestHandler(registerController)
)

export default usersRouter
