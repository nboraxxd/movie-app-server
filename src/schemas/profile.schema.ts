import z from 'zod'

export const getProfileResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
    isVerified: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export type GetProfileResponseType = z.TypeOf<typeof getProfileResponseSchema>
