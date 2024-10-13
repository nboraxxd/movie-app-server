import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'

import { initFolder } from '@/utils/files'
import { openapiSpecification } from '@/utils/swagger'
import envVariables from '@/schemas/env-variables.schema'
import databaseService from '@/services/database.services'
import { authorizationValidator } from '@/middlewares/validators.middleware'
import { defaultErrorHandler } from '@/middlewares/default-error.middleware'
import authRouter from '@/routes/auth.routes'
import trendingRouter from '@/routes/trending.routes'
import profileRouter from '@/routes/profile.routes'
import favoritesRouter from '@/routes/favorites.routes'
import moviesRouter from '@/routes/movies.routes'
import tvsRouter from '@/routes/tvs.routes'

const app = express()
const port = envVariables.PORT

// kết nối với database
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFavorites()
})

// Quy định CORS
app.use(cors({ origin: envVariables.DOMAIN_ALLOW_LIST.split(', '), optionsSuccessStatus: 200 }))

// tạo folder uploads
initFolder()

// parse json của client gởi lên, chuyển thành dạnh object để xử lý
app.use(express.json())

app.use('/api', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

app.use('/auth', authRouter)

app.use('/profile', profileRouter)

app.use('/trending', authorizationValidator({ isLoginRequired: false }), trendingRouter)

app.use('/movies', authorizationValidator({ isLoginRequired: false }), moviesRouter)

app.use('/tvs', authorizationValidator({ isLoginRequired: false }), tvsRouter)

app.use('/favorites', favoritesRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
