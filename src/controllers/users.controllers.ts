import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import usersService from '@/services/users.services'
import { HttpStatusCode } from '@/constants/http-status-code'
import { RegisterBodyType, RegisterResponseType } from '@/schemas/user.schema'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterBodyType>,
  res: Response<RegisterResponseType>
) => {
  const { email, name, password } = req.body

  const result = await usersService.register({ email, name, password })

  return res
    .status(HttpStatusCode.Created)
    .json({ message: 'Please check your email to verify your account.', data: result })
}
