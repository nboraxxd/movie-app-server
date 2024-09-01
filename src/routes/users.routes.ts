import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { RegisterBodySchema } from '@/schemas/user.schema'
import { zodValidator } from '@/middlewares/zod-validator.middleware'
import { registerController } from '@/controllers/users.controllers'

const usersRouter = Router()

usersRouter.post('/register', zodValidator(RegisterBodySchema, 'body'), wrapRequestHandler(registerController))

export default usersRouter
