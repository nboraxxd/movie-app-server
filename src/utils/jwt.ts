import { Request } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types/token.type'
import envVariables from '@/schemas/env-variables.schema'
import { EmailVerifyTokenType, RefreshTokenType } from '@/schemas/auth.schema'

type SignTokenType = {
  payload: Omit<TokenPayload, 'iat' | 'exp'>
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

export async function decodeEmailVerifyToken(req: Request<ParamsDictionary, any, EmailVerifyTokenType>) {
  const decodedEmailVerifyToken = await verifyToken({
    token: req.body.emailVerifyToken,
    jwtKey: envVariables.JWT_SECRET_EMAIL_VERIFY_TOKEN,
  })

  req.decodedEmailVerifyToken = decodedEmailVerifyToken
}

export async function decodeRefreshToken(req: Request<ParamsDictionary, any, RefreshTokenType>) {
  const decodedEmailVerifyToken = await verifyToken({
    token: req.body.refreshToken,
    jwtKey: envVariables.JWT_SECRET_REFRESH_TOKEN,
  })

  req.decodedRefreshToken = decodedEmailVerifyToken
}
