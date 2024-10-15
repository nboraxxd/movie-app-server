import z from 'zod'

import { emailSchema, nameSchema, passwordSchema } from '@/schemas/common.schema'

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

export const registerBodySchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string({ required_error: 'confirmPassword is required' })
      .min(6, { message: 'confirmPassword must be at least 6 characters' }),
  })
  .strict({ message: 'Additional properties not allowed' })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof registerBodySchema>

export const loginBodySchema = z
  .object({ email: emailSchema, password: passwordSchema })
  .strict({ message: 'Additional properties not allowed' })

export type LoginBodyType = z.TypeOf<typeof loginBodySchema>

export const refreshTokenSchema = z
  .object({ refreshToken: z.string({ required_error: 'Refresh token is required' }) })
  .strict({ message: 'Additional properties not allowed' })

export type RefreshTokenType = z.TypeOf<typeof refreshTokenSchema>

export const changePasswordBodySchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: z
      .string({ required_error: 'confirmNewPassword is required' })
      .min(6, { message: 'confirmNewPassword must be at least 6 characters' }),
  })
  .strict({ message: 'Additional properties not allowed' })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      })
    }
  })

export type ChangePasswordBodyType = z.TypeOf<typeof changePasswordBodySchema>

export const forgotPasswordBodySchema = z
  .object({
    email: emailSchema,
  })
  .strict({ message: 'Additional properties not allowed' })

export type ForgotPasswordBodyType = z.TypeOf<typeof forgotPasswordBodySchema>
