import { Router } from 'express'

const testRouter = Router()

testRouter.use(
  (req, res, next) => {
    console.log('Time:', Date.now())
    next()
  },
  (req, res, next) => {
    console.log('Request Type:', req.method)
    next()
  }
)

testRouter.get('/test', (req, res) => {
  res.json({ message: 'Hello World!' })
})

export default testRouter
