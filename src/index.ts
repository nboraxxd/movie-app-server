import express from 'express'

import { envVariables } from '@/constants/env-variables'
import testRouter from '@/test.routes'

const app = express()
const port = envVariables.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', testRouter)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
