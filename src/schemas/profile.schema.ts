import z from 'zod'
import { AVATAR_SIZE_LIMIT } from '@/constants'
import { nameSchema, passwordSchema } from '@/schemas/common.schema'

export const userDocumentResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string().nullable(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserDocumentResponseType = z.TypeOf<typeof userDocumentResponseSchema>

export const getProfileResponseSchema = z.object({
  message: z.string(),
  data: userDocumentResponseSchema,
})

export type GetProfileResponseType = z.TypeOf<typeof getProfileResponseSchema>

export const avatarSchema = z.object({
  fieldname: z.literal('avatar'),
  mimetype: z.string().refine((mimetype) => mimetype.startsWith('image/'), 'avatar must be an image'),
  size: z.number().max(AVATAR_SIZE_LIMIT, 'avatar must be less than 1MB'),
})

export type AvatarType = z.TypeOf<typeof avatarSchema>

export const updateProfileBodySchema = z
  .object({
    name: nameSchema.optional(),
    avatar: z.string().optional(),
  })
  .strict({ message: 'Additional properties not allowed' })

export type UpdateProfileBodyType = z.TypeOf<typeof updateProfileBodySchema>

export const updateProfileResponseSchema = z.object({
  message: z.string(),
  data: userDocumentResponseSchema,
})

export type UpdateProfileResponseType = z.TypeOf<typeof updateProfileResponseSchema>

export const deleteMyAccountBodySchema = z
  .object({
    password: passwordSchema,
  })
  .strict({ message: 'Additional properties not allowed' })

export type DeleteMyAccountBodyType = z.TypeOf<typeof deleteMyAccountBodySchema>
