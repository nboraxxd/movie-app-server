import z from 'zod'

export const RegisterBody = z
  .object({
    name: z.string({ required_error: 'Name is required' }).trim(),
    email: z.string({ required_error: 'Email is required' }).trim().email({ message: 'Invalid email' }),
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

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const registerResponse = z.object({
  message: z.string(),
})

export type RegisterResponseType = z.TypeOf<typeof registerResponse>
