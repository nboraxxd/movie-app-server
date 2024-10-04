import z from 'zod'

export const getProfileResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
    is_verified: z.boolean(),
    created_at: z.date(),
    updated_at: z.date(),
  }),
})

export type GetProfileResponseType = z.TypeOf<typeof getProfileResponseSchema>
