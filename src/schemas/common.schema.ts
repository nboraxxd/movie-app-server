import z from 'zod'

export const emailSchema = z.string({ required_error: 'Email is required' }).trim().email({ message: 'Invalid email' })

export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(6, { message: 'Password must be at least 6 characters' })

export const messageResponseSchema = z.object({
  message: z.string(),
})

export type MessageResponseType = z.TypeOf<typeof messageResponseSchema>
