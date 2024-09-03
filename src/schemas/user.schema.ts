import z from 'zod'

import usersService from '@/services/users.services'

const email = z.string({ required_error: 'Email is required' }).trim().email({ message: 'Invalid email' })
const password = z
  .string({ required_error: 'Password is required' })
  .min(6, { message: 'Password must be at least 6 characters' })

export const RegisterBodySchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }).trim(),
    email: email
      // Delete this refine when using in frontend
      .refine(
        async (email) => {
          const user = await usersService.findByEmail(email)
          return !user
        },
        { message: 'Email already exists' }
      ),
    password,
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

export type RegisterBodyType = z.TypeOf<typeof RegisterBodySchema>

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

export const LoginBodySchema = z.object({ email, password })

export type LoginBodyType = z.TypeOf<typeof LoginBodySchema>
