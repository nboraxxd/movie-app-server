import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { authorizationValidator, zodValidator } from '@/middlewares/validators.middleware'
import { addFavoriteController } from '@/controllers/favorites.controllers'
import { addFavoriteBodySchema } from '@/schemas/favorite.schema'
import authService from '@/services/auth.services'

const favoritesRouter = Router()

favoritesRouter.post(
  '/',
  authorizationValidator({ isLoginRequired: true, customHandler: authService.checkUserVerification }),
  zodValidator(addFavoriteBodySchema, { location: 'body' }),
  wrapRequestHandler(addFavoriteController)
)

export default favoritesRouter
