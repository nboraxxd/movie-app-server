import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { RegisterBodySchema } from '@/schemas/user.schema'
import { formValidator } from '@/middlewares/validators.middleware'
import { registerController } from '@/controllers/users.controllers'

const usersRouter = Router()

usersRouter.post('/register', formValidator(RegisterBodySchema), wrapRequestHandler(registerController))

export default usersRouter
