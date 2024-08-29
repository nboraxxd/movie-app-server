import { loginValidator } from '@/middlewares/users.middlewares'
import { Router } from 'express'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, (req, res) => {
  res.json({ message: 'Login' })
})

export default usersRouter
