import ms from 'ms'
import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { verifyToken } from '@/utils/jwt'
import { TokenPayload } from '@/types/token.type'
import { HttpStatusCode } from '@/constants/http-status-code'
import { calculateRemainingTimeInSeconds } from '@/utils/common'
import authService from '@/services/auth.services'
import User from '@/models/user.model'
import { ErrorWithStatus } from '@/models/errors'
import envVariables from '@/schemas/env-variables.schema'
import { MessageResponseType } from '@/schemas/common.schema'
import {
  AuthResponseType,
  ChangePasswordBodyType,
  EmailVerifyTokenType,
  LoginBodyType,
  RefreshTokenType,
  RegisterBodyType,
} from '@/schemas/auth.schema'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterBodyType>,
  res: Response<AuthResponseType>
) => {
  const { email, name, password } = req.body

  const result = await authService.register({ email, name, password })

  return res
    .status(HttpStatusCode.Created)
    .json({ message: 'Please check your email to verify your account', data: result })
}

export const resendEmailVerificationController = async (req: Request, res: Response<MessageResponseType>) => {
  const { emailVerifyToken, email, name, _id } = req.user as User

  const decodedEmailVerifyToken = await verifyToken({
    token: emailVerifyToken as string,
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

  await authService.resendEmailVerification({ email, name, userId: _id as ObjectId })

  return res.json({ message: 'Please check your email to verify your account' })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, EmailVerifyTokenType>,
  res: Response<AuthResponseType>
) => {
  const { userId } = req.decodedEmailVerifyToken as TokenPayload

  const result = await authService.verifyEmail(userId)

  return res.json({ message: 'Verify email successful', data: result })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginBodyType>,
  res: Response<AuthResponseType>
) => {
  const { _id } = req.user as { _id: ObjectId }

  const result = await authService.login(_id.toHexString())

  return res.json({ message: 'Login successful', data: result })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenType>,
  res: Response<AuthResponseType>
) => {
  const { exp, userId } = req.decodedRefreshToken as TokenPayload

  const result = await authService.refreshToken({ exp, userId })

  return res.json({ message: 'Refresh token successful', data: result })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, RefreshTokenType>,
  res: Response<MessageResponseType>
) => {
  const { refreshToken } = req.body

  await authService.logout(refreshToken)

  return res.json({ message: 'Logout successful' })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordBodyType>,
  res: Response<MessageResponseType>
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const { newPassword } = req.body

  await authService.changePassword({ userId, newPassword })

  return res.json({ message: 'Change password successful' })
}
