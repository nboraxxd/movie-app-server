import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { registerBodySchema } from '@/schemas/user.schema'
import { zodValidator } from '@/middlewares/validators.middleware'
import { registerController } from '@/controllers/users.controllers'
import usersService from '@/services/users.services'

const usersRouter = Router()

usersRouter.post(
  '/register',
  zodValidator(registerBodySchema, 'body', usersService.validateUserRegister),
  wrapRequestHandler(registerController)
)

export default usersRouter
