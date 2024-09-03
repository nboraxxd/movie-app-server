import ms from 'ms'
import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { verifyToken } from '@/utils/jwt'
import { TokenPayload } from '@/types/token.type'
import { HttpStatusCode } from '@/constants/http-status-code'
import { calculateRemainingTimeInSeconds } from '@/utils/common'
import authService from '@/services/auth.services'
import usersService from '@/services/users.services'
import User from '@/models/user.model'
import { ErrorWithStatus } from '@/models/errors'
import envVariables from '@/schemas/env-variables.schema'
import { MessageResponseType } from '@/schemas/common.schema'
import { AuthResponseType, EmailVerifyTokenType, LoginBodyType, RefreshTokenType } from '@/schemas/auth.schema'

export const resendEmailVerificationController = async (req: Request, res: Response<MessageResponseType>) => {
  const { userId } = req.decodedAuthorization as TokenPayload

  const user = await usersService.findById(userId)

  if (!user) {
    throw new ErrorWithStatus({
      message: 'User not found',
      statusCode: HttpStatusCode.NotFound,
    })
  }

  if (user.email_verify_token === null) {
    throw new ErrorWithStatus({
      message: 'Account has been verified',
      statusCode: HttpStatusCode.BadRequest,
    })
  }

  const decodedEmailVerifyToken = await verifyToken({
    token: user.email_verify_token,
    jwtKey: envVariables.JWT_SECRET_EMAIL_VERIFY_TOKEN,
  })

  const nextEmailResendTime = new Date(decodedEmailVerifyToken.iat * 1000 + ms(envVariables.RESEND_EMAIL_DEBOUNCE_TIME))

  const remainingTimeInSeconds = calculateRemainingTimeInSeconds(nextEmailResendTime)

  if (remainingTimeInSeconds > 0) {
    throw new ErrorWithStatus({
      message: `Please try again in ${remainingTimeInSeconds} seconds`,
      statusCode: HttpStatusCode.TooManyRequests,
    })
  }

  await authService.resendEmailVerification({ email: user.email, name: user.name, userId: user._id })

  return res.json({ message: 'Please check your email to verify your account.' })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, EmailVerifyTokenType>,
  res: Response<AuthResponseType>
) => {
  const { userId } = req.decodedEmailVerifyToken as TokenPayload

  const user = await usersService.findById(userId)

  if (!user) {
    throw new ErrorWithStatus({
      message: 'User not found',
      statusCode: HttpStatusCode.NotFound,
    })
  }

  if (user.email_verify_token === null) {
    throw new ErrorWithStatus({
      message: 'Account has been verified',
      statusCode: HttpStatusCode.BadRequest,
    })
  }

  const result = await authService.verifyEmail(userId)

  return res.json({ message: 'Email verified successfully', data: result })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginBodyType>,
  res: Response<AuthResponseType>
) => {
  const { _id } = req.user as User

  const result = await authService.login((_id as ObjectId).toHexString())

  return res.json({ message: 'Login successful', data: result })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, RefreshTokenType>,
  res: Response<MessageResponseType>
) => {
  const { refreshToken } = req.body

  await authService.logout(refreshToken)

  return res.json({ message: 'Logout successful' })
}
