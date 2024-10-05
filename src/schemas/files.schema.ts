import z from 'zod'

import envVariables from '@/schemas/env-variables.schema'

export const avatarSchema = z.object({
  fieldname: z.literal('avatar'),
  mimetype: z.string().refine((mimetype) => mimetype.startsWith('image/'), 'avatar must be an image'),
  size: z.number().max(envVariables.CLOUDINARY_AVATAR_SIZE_LIMIT, 'avatar must be less than 1MB'),
})

export type AvatarType = z.TypeOf<typeof avatarSchema>
