import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { EmailVerifyTokenSchema, LoginBodySchema, RegisterBodySchema } from '@/schemas/user.schema'
import { formValidator, requireLoginValidator, tokenValidator } from '@/middlewares/validators.middleware'
import {
  loginController,
  registerController,
  resendEmailVerificationController,
  verifyEmailController,
} from '@/controllers/users.controllers'

const usersRouter = Router()

usersRouter.post('/register', formValidator(RegisterBodySchema), wrapRequestHandler(registerController))

usersRouter.post(
  '/resend-email-verification',
  requireLoginValidator(),
  wrapRequestHandler(resendEmailVerificationController)
)

usersRouter.post('/verify-email', tokenValidator(EmailVerifyTokenSchema), wrapRequestHandler(verifyEmailController))

usersRouter.post('/login', formValidator(LoginBodySchema), wrapRequestHandler(loginController))

export default usersRouter
