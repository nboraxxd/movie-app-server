import jwt, { SignOptions } from 'jsonwebtoken'

import { TokenPayload } from '@/types/token.type'

type SignTokenType = {
  payload: Omit<TokenPayload, 'iat' | 'exp'>
  privateKey: string
  options?: SignOptions
}

type VerifyTokenType = {
  token: string
  secretOrPublicKey: string
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

export function verifyToken({ token, secretOrPublicKey }: VerifyTokenType) {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        throw reject(err)
      }

      resolve(decoded as TokenPayload)
    })
  })
}
