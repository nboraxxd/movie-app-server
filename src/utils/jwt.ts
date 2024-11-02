import { Request } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types/token.type'
import envVariables from '@/schemas/env-variables.schema'
import { EmailVerifyTokenType, RefreshTokenType } from '@/schemas/auth.schema'

type SignTokenType = {
  payload: Pick<TokenPayload, 'userId' | 'tokenType'> & { exp?: number }
  privateKey: string
  options?: SignOptions
}

type VerifyTokenType = {
  token: string
  jwtKey: string
}

export function signToken({ payload, privateKey, options = { algorithm: 'HS256' } }: SignTokenType) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }

      resolve(token as string)
    })
  })
}

export function verifyToken({ token, jwtKey }: VerifyTokenType) {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        throw reject(err)
      }

      resolve(decoded as TokenPayload)
    })
  })
}

export async function verifyEmailVerifyToken(token: string) {
  return verifyToken({
    token: token,
    jwtKey: envVariables.JWT_SECRET_EMAIL_VERIFY_TOKEN,
  })
}

export async function attachDecodedEmailVerifyTokenToReq(req: Request<ParamsDictionary, any, EmailVerifyTokenType>) {
  const decodedEmailVerifyToken = await verifyEmailVerifyToken(req.body.emailVerifyToken)
  req.decodedEmailVerifyToken = decodedEmailVerifyToken
}

export async function attachDecodedAuthorizationTokenToReq(token: string, req: Request) {
  const decodedAuthorizationToken = await verifyToken({
    token,
    jwtKey: envVariables.JWT_SECRET_ACCESS_TOKEN,
  })

  req.decodedAuthorization = decodedAuthorizationToken
}

export async function verifyRefreshToken(token: string) {
  return verifyToken({
    token,
    jwtKey: envVariables.JWT_SECRET_REFRESH_TOKEN,
  })
}

export async function attachDecodedRefreshTokenToReq(req: Request<ParamsDictionary, any, RefreshTokenType>) {
  const decodedRefreshToken = await verifyRefreshToken(req.body.refreshToken)
  req.decodedRefreshToken = decodedRefreshToken
}

export async function verifyResetPasswordToken(token: string) {
  return verifyToken({
    token: token,
    jwtKey: envVariables.JWT_SECRET_RESET_PASSWORD_TOKEN,
  })
}
