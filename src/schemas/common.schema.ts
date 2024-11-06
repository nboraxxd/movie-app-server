import z from 'zod'

export const nameSchema = z.string().trim().min(1, { message: 'Name is required' })

export const emailSchema = z.string({ required_error: 'Email is required' }).trim().email({ message: 'Invalid email' })

export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(6, { message: 'Password must be at least 6 characters' })

export const paginationResponseSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  count: z.number(),
})

export type PaginationResponseType = z.TypeOf<typeof paginationResponseSchema>

export const queryPageSchema = z.coerce
  .number({ message: 'Page must be a number' })
  .int({ message: 'Page must be an integer' })
  .positive({ message: 'Page must be a positive number' })
  .max(500, { message: 'API just support maximum 500 pages' })
  .optional()

export type QueryPageType = z.TypeOf<typeof queryPageSchema>

export const messageResponseSchema = z.object({
  message: z.string(),
})

export type MessageResponseType = z.TypeOf<typeof messageResponseSchema>

export const clientUrlShema = z
  .string()
  .url({ message: 'clientUrl must be a valid URL' })
  .regex(/^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, {
    message: 'clientUrl must be a valid URL',
  })
