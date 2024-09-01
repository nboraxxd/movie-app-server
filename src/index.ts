import express from 'express'

import envVariables from '@/schemas/env-variables.schema'
import usersRouter from '@/routes/users.routes'
import databaseService from '@/services/database.services'

const app = express()
const port = envVariables.PORT

// kết nối với database
databaseService.connect()

// parse json của client gởi lên, chuyển thành dạnh object để xử lý
app.use(express.json())

app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
