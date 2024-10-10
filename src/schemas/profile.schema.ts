import z from 'zod'
import { AVATAR_SIZE_LIMIT } from '@/constants'

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

export const avatarSchema = z.object({
  fieldname: z.literal('avatar'),
  mimetype: z.string().refine((mimetype) => mimetype.startsWith('image/'), 'avatar must be an image'),
  size: z.number().max(AVATAR_SIZE_LIMIT, 'avatar must be less than 1MB'),
})

export type AvatarType = z.TypeOf<typeof avatarSchema>
