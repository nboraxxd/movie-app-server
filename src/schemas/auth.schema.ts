import z from 'zod'

import { EmailSchema, PasswordSchema } from '@/schemas/common.schema'

export const AuthResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
})

export type AuthResponseType = z.TypeOf<typeof AuthResponseSchema>

export const AuthorizationSchema = z.object({
  authorization: z.string({ required_error: 'Access token is required' }),
})

export type AuthorizationType = z.TypeOf<typeof AuthorizationSchema>

export const EmailVerifyTokenSchema = z
  .object({
    emailVerifyToken: z.string({ required_error: 'Email verify token is required' }),
  })
  .strict({ message: 'Additional properties not allowed' })

export type EmailVerifyTokenType = z.TypeOf<typeof EmailVerifyTokenSchema>

export const LoginBodySchema = z
  .object({ email: EmailSchema, password: PasswordSchema })
  .strict({ message: 'Additional properties not allowed' })

export type LoginBodyType = z.TypeOf<typeof LoginBodySchema>

export const RefreshTokenSchema = z
  .object({ refreshToken: z.string({ required_error: 'Refresh token is required' }) })
  .strict({ message: 'Additional properties not allowed' })

export type RefreshTokenType = z.TypeOf<typeof RefreshTokenSchema>
