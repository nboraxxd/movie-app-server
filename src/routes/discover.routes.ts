import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { zodValidator } from '@/middlewares/validators.middleware'
import { discoverQuerySchema, discoverTypeSchema } from '@/schemas/discover.schema'
import { discoverController } from '@/controllers/discover.controllers'

const discoverRouter = Router()

discoverRouter.get(
  '/:discoverType',
  zodValidator(discoverTypeSchema, 'params'),
  zodValidator(discoverQuerySchema, 'query'),
  wrapRequestHandler(discoverController)
)

export default discoverRouter
