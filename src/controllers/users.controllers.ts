import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { HttpStatusCode } from '@/constants/http-status-code'
import usersService from '@/services/users.services'
import { RegisterBodyType } from '@/schemas/user.schema'
import { AuthResponseType } from '@/schemas/auth.schema'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterBodyType>,
  res: Response<AuthResponseType>
) => {
  const { email, name, password } = req.body

  const result = await usersService.register({ email, name, password })

  return res
    .status(HttpStatusCode.Created)
    .json({ message: 'Please check your email to verify your account.', data: result })
}
