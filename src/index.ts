import express from 'express'

import envVariables from '@/schemas/env-variables.schema'
import databaseService from '@/services/database.services'
import { defaultErrorHandler } from '@/middlewares/default-error.middleware'
import usersRouter from '@/routes/users.routes'
import authRouter from '@/routes/auth.routes'
import moviesRouter from '@/routes/movies.routes'

const app = express()
const port = envVariables.PORT

// kết nối với database
databaseService.connect()

// parse json của client gởi lên, chuyển thành dạnh object để xử lý
app.use(express.json())

app.use('/users', usersRouter)

app.use('/auth', authRouter)

app.use('/movies', moviesRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
