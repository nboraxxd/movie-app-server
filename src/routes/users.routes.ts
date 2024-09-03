import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { RegisterBodySchema } from '@/schemas/user.schema'
import { zodValidator } from '@/middlewares/zod-validator.middleware'
import { requireLoginValidator } from '@/middlewares/require-login-validator.middleware'
import { registerController, resendEmailVerificationController } from '@/controllers/users.controllers'

const usersRouter = Router()

usersRouter.post('/register', zodValidator(RegisterBodySchema, 'body'), wrapRequestHandler(registerController))

usersRouter.post(
  '/resend-email-verification',
  requireLoginValidator(),
  wrapRequestHandler(resendEmailVerificationController)
)

export default usersRouter
