import { Router } from 'express'

import usersService from '@/services/users.services'
import { wrapRequestHandler } from '@/utils/handlers'
import { decodeEmailVerifyToken, decodeRefreshToken } from '@/utils/jwt'
import { emailVerifyTokenSchema, loginBodySchema, refreshTokenSchema } from '@/schemas/auth.schema'
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
  tokenValidator(emailVerifyTokenSchema, decodeEmailVerifyToken),
  wrapRequestHandler(verifyEmailController)
)

authRouter.post(
  '/login',
  zodValidator(loginBodySchema, 'body', usersService.validateUserLogin),
  wrapRequestHandler(loginController)
)

authRouter.post(
  '/logout',
  requireLoginValidator(),
  tokenValidator(refreshTokenSchema, decodeRefreshToken),
  wrapRequestHandler(logoutController)
)

export default authRouter
