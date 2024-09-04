import z from 'zod'

import { emailSchema, passwordSchema } from '@/schemas/common.schema'

export const authResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
})

export type AuthResponseType = z.TypeOf<typeof authResponseSchema>

export const authorizationSchema = z.object({
  authorization: z.string({ required_error: 'Access token is required' }),
})

export type AuthorizationType = z.TypeOf<typeof authorizationSchema>

export const emailVerifyTokenSchema = z
  .object({
    emailVerifyToken: z.string({ required_error: 'Email verify token is required' }),
  })
  .strict({ message: 'Additional properties not allowed' })

export type EmailVerifyTokenType = z.TypeOf<typeof emailVerifyTokenSchema>

export const loginBodySchema = z
  .object({ email: emailSchema, password: passwordSchema })
  .strict({ message: 'Additional properties not allowed' })

export type LoginBodyType = z.TypeOf<typeof loginBodySchema>

export const refreshTokenSchema = z
  .object({ refreshToken: z.string({ required_error: 'Refresh token is required' }) })
  .strict({ message: 'Additional properties not allowed' })

export type RefreshTokenType = z.TypeOf<typeof refreshTokenSchema>
