import { userDocumentResponseSchema } from '@/schemas/profile.schema'
import z from 'zod'

const commentDocumentSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  mediaId: z.number(),
  mediaTitle: z.string(),
  mediaType: z.enum(['movie', 'tv']),
  mediaPoster: z.string().nullable(),
  mediaReleaseDate: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CommentDocumentType = z.TypeOf<typeof commentDocumentSchema>

export const addCommentBodySchema = z
  .object({
    mediaId: z.number(),
    mediaTitle: z.string(),
    mediaType: z.enum(['movie', 'tv']),
    mediaPoster: z.string().nullable(),
    mediaReleaseDate: z.string(),
    content: z.string().min(1).max(500),
  })
  .strict({ message: 'Additional properties not allowed' })

export type AddCommentBodyType = z.TypeOf<typeof addCommentBodySchema>

export const addCommentResponseSchema = z.object({
  message: z.string(),
  data: commentDocumentSchema.omit({ userId: true }).merge(z.object({ user: userDocumentResponseSchema })),
})

export type AddCommentResponseType = z.TypeOf<typeof addCommentResponseSchema>
