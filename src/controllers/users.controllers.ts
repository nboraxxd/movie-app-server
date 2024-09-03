import ms from 'ms'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import usersService from '@/services/users.services'
import { HttpStatusCode } from '@/constants/http-status-code'
import envVariables from '@/schemas/env-variables.schema'
import { MessageResponseType } from '@/schemas/common.schema'
import { RegisterBodyType, RegisterResponseType } from '@/schemas/user.schema'
import { TokenPayload } from '@/types/token.type'
import { ErrorWithStatus } from '@/models/errors'
import { verifyToken } from '@/utils/jwt'
import { calculateRemainingTimeInSeconds } from '@/utils/common'

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

export const resendEmailVerificationController = async (req: Request, res: Response<MessageResponseType>) => {
  const { isVerified, userId } = req.decodedAuthorization as TokenPayload

  if (isVerified === true) {
    throw new ErrorWithStatus({
      message: 'Account has been verified',
      statusCode: 400,
    })
  }

  const user = await usersService.findById(userId)

  if (!user) {
    throw new ErrorWithStatus({
      message: 'User not found',
      statusCode: 404,
    })
  }

  const decodedEmailVerifyToken = await verifyToken({
    token: user.email_verify_token as string,
    secretOrPublicKey: envVariables.JWT_SECRET_EMAIL_VERIFY_TOKEN,
  })

  const nextEmailResendTime = new Date(decodedEmailVerifyToken.iat * 1000 + ms(envVariables.RESEND_EMAIL_DEBOUNCE_TIME))

  const remainingTimeInSeconds = calculateRemainingTimeInSeconds(nextEmailResendTime)

  if (remainingTimeInSeconds > 0) {
    throw new ErrorWithStatus({
      message: `Please try again in ${remainingTimeInSeconds} seconds`,
      statusCode: 429,
    })
  }

  await usersService.resendEmailVerification({ email: user.email, name: user.name, userId: user._id })

  return res.json({ message: 'Please check your email to verify your account.' })
}
