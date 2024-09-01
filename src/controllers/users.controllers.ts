import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { HttpStatusCode } from '@/constants/http-status-code'
import { RegisterBodyType, RegisterResponseType } from '@/schemas/user.schema'
import usersService from '@/services/users.services'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterBodyType>,
  res: Response<RegisterResponseType>
) => {
  const { email, name, password } = req.body

  try {
    const result = await usersService.register({ email, name, password })

    return res.status(HttpStatusCode.Created).json({ message: 'Register success', data: result })
  } catch (error: any) {
    return res.status(HttpStatusCode.InternalServerError).json({ message: error.message })
  }
}
