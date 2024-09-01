import { Router } from 'express'

import { loginValidator } from '@/middlewares/users.middlewares'
import { registerController } from '@/controllers/users.controllers'
import { zodValidator } from '@/middlewares/validator.middleware'
import { RegisterBody } from '@/schemas/user.schema'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, (req, res) => {
  res.json({ message: 'Login' })
})

usersRouter.post('/register', zodValidator(RegisterBody, 'body'), registerController)

export default usersRouter
