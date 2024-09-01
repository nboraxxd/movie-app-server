import z from 'zod'

import databaseService from '@/services/database.services'

export const RegisterBodySchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }).trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email({ message: 'Invalid email' })
      // Delete this refine when using in frontend
      .refine(
        async (email) => {
          const user = await databaseService.users.findOne({ email })
          return !user
        },
        { message: 'Email already exists' }
      ),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' }),
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

export const registerResponse = z.object({
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
})

export type RegisterResponseType = z.TypeOf<typeof registerResponse>
