import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { popularMoviesController } from '@/controllers/movies.controllers'
import { zodValidator } from '@/middlewares/validators.middleware'
import { moviesQuerySchema } from '@/schemas/movies.schema'

const moviesRouter = Router()

moviesRouter.get('/popular', zodValidator(moviesQuerySchema, 'query'), wrapRequestHandler(popularMoviesController))

export default moviesRouter
