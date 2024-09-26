import z from 'zod'

export const emailSchema = z.string({ required_error: 'Email is required' }).trim().email({ message: 'Invalid email' })

export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(6, { message: 'Password must be at least 6 characters' })

export const resPaginationSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  count: z.number(),
})

export const queryPageSchema = z.coerce
  .number({ message: 'Page must be a number' })
  .int({ message: 'Page must be an integer' })
  .positive({ message: 'Page must be a positive number' })
  .default(1)
  .optional()

export const messageResponseSchema = z.object({
  message: z.string(),
})

export type MessageResponseType = z.TypeOf<typeof messageResponseSchema>
