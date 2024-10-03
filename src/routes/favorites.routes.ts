import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { authorizationValidator, zodValidator } from '@/middlewares/validators.middleware'
import { addFavoriteController } from '@/controllers/favorites.controllers'
import { addFavoriteBodySchema } from '@/schemas/favorite.schema'

const favoritesRouter = Router()

favoritesRouter.post(
  '/',
  authorizationValidator({ isLoginRequired: true }),
  zodValidator(addFavoriteBodySchema, 'body'),
  wrapRequestHandler(addFavoriteController)
)

export default favoritesRouter
