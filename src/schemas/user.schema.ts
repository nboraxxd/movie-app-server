import z from 'zod'

import usersService from '@/services/users.services'
import { EmailSchema, PasswordSchema } from '@/schemas/common.schema'

export const RegisterBodySchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }).trim(),
    email: EmailSchema
      // Delete this refine when using in frontend
      .refine(
        async (email) => {
          const user = await usersService.findByEmail(email)
          return !user
        },
        { message: 'Email already exists' }
      ),
    password: PasswordSchema,
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
