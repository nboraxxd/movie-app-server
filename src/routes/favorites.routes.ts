import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { loginValidator } from '@/middlewares/validators.middleware'
import { favoriteController } from '@/controllers/favorites.controllers'

const favoritesRouter = Router()

favoritesRouter.post('/', loginValidator(), wrapRequestHandler(favoriteController))

export default favoritesRouter
