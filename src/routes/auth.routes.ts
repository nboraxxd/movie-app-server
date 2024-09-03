import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { EmailVerifyTokenSchema, LoginBodySchema } from '@/schemas/auth.schema'
import { formValidator, requireLoginValidator, tokenValidator } from '@/middlewares/validators.middleware'
import {
  loginController,
  resendEmailVerificationController,
  verifyEmailController,
} from '@/controllers/auth.controllers'

const authRouter = Router()

authRouter.post(
  '/resend-email-verification',
  requireLoginValidator(),
  wrapRequestHandler(resendEmailVerificationController)
)

authRouter.post('/verify-email', tokenValidator(EmailVerifyTokenSchema), wrapRequestHandler(verifyEmailController))

authRouter.post('/login', formValidator(LoginBodySchema), wrapRequestHandler(loginController))

export default authRouter
