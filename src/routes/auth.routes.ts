import { Router } from 'express'

import usersService from '@/services/users.services'
import { wrapRequestHandler } from '@/utils/handlers'
import { decodeEmailVerifyToken, decodeRefreshToken } from '@/utils/jwt'
import { EmailVerifyTokenSchema, LoginBodySchema, RefreshTokenSchema } from '@/schemas/auth.schema'
import { zodValidator, requireLoginValidator, tokenValidator } from '@/middlewares/validators.middleware'
import {
  loginController,
  logoutController,
  resendEmailVerificationController,
  verifyEmailController,
} from '@/controllers/auth.controllers'

const authRouter = Router()

authRouter.post(
  '/resend-email-verification',
  requireLoginValidator(),
  wrapRequestHandler(resendEmailVerificationController)
)

authRouter.post(
  '/verify-email',
  tokenValidator(EmailVerifyTokenSchema, decodeEmailVerifyToken),
  wrapRequestHandler(verifyEmailController)
)

authRouter.post(
  '/login',
  zodValidator(LoginBodySchema, usersService.validateUserLogin),
  wrapRequestHandler(loginController)
)

authRouter.post(
  '/logout',
  requireLoginValidator(),
  tokenValidator(RefreshTokenSchema, decodeRefreshToken),
  wrapRequestHandler(logoutController)
)

export default authRouter
