import z from 'zod'

import { emailSchema, passwordSchema } from '@/schemas/common.schema'

export const registerBodySchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }).trim(),
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
