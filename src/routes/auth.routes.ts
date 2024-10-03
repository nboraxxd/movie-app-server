import { Router } from 'express'

import usersService from '@/services/users.services'
import { wrapRequestHandler } from '@/utils/handlers'
import { decodeEmailVerifyToken, decodeRefreshToken } from '@/utils/jwt'
import { emailVerifyTokenSchema, loginBodySchema, refreshTokenSchema } from '@/schemas/auth.schema'
import { zodValidator, authorizationValidator, tokenValidator } from '@/middlewares/validators.middleware'
import {
  loginController,
  logoutController,
  resendEmailVerificationController,
  verifyEmailController,
} from '@/controllers/auth.controllers'

const authRouter = Router()

authRouter.post(
  '/resend-email-verification',
  authorizationValidator({ isLoginRequired: true }),
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
  authorizationValidator({ isLoginRequired: true }),
  tokenValidator(refreshTokenSchema, decodeRefreshToken),
  wrapRequestHandler(logoutController)
)

export default authRouter
