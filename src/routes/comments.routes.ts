import { Router } from 'express'

import authService from '@/services/auth.services'
import { wrapRequestHandler } from '@/utils/handlers'
import { addCommentBodySchema } from '@/schemas/comments.schema'
import { addCommentController } from '@/controllers/comments.controllers'
import { authorizationValidator, zodValidator } from '@/middlewares/validators.middleware'

const commentsRouter = Router()

commentsRouter.post(
  '/',
  authorizationValidator({ isLoginRequired: true, customHandler: authService.checkUserVerification }),
  zodValidator(addCommentBodySchema, { location: 'body' }),
  wrapRequestHandler(addCommentController)
)

export default commentsRouter
