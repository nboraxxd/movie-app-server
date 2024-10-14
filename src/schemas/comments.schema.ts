import z from 'zod'
import { ObjectId, WithId } from 'mongodb'

import { userDocumentResponseSchema } from '@/schemas/profile.schema'
import { paginationResponseSchema, queryPageSchema } from '@/schemas/common.schema'

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

const commentDataResponseSchema = commentDocumentSchema
  .omit({ userId: true })
  .merge(z.object({ user: userDocumentResponseSchema.omit({ createdAt: true, updatedAt: true }) }))

export type CommentDataResponseType = z.TypeOf<typeof commentDataResponseSchema>

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
  data: commentDataResponseSchema,
})

export type AddCommentResponseType = z.TypeOf<typeof addCommentResponseSchema>

export const getCommentsByMediaParams = z
  .object({
    mediaId: z.coerce.number(),
    mediaType: z.enum(['movie', 'tv']),
  })
  .strict({ message: 'Additional properties not allowed' })

export type GetCommentsByMediaParamsType = z.TypeOf<typeof getCommentsByMediaParams>

export const getCommentsQuery = z.object({
  page: queryPageSchema,
})

export type GetCommentsQueryType = z.TypeOf<typeof getCommentsQuery>

export const getCommentsByMediaResponseSchema = z.object({
  message: z.string(),
  data: z.array(commentDataResponseSchema),
  pagination: paginationResponseSchema,
})

export type GetCommentsByMediaResponseType = z.TypeOf<typeof getCommentsByMediaResponseSchema>

export type AggregatedCommentType = WithId<Omit<GetCommentsByMediaResponseType['data'][number], '_id'>> & {
  user: WithId<Omit<GetCommentsByMediaResponseType['data'][number]['user'], '_id'>>
}

export const getCommentsByUserIdParams = z
  .object({
    userId: z.string().refine(
      (value) => {
        if (ObjectId.isValid(value)) {
          return true
        }
      },
      { message: 'Invalid user id' }
    ),
  })
  .strict({ message: 'Additional properties not allowed' })

export type GetCommentsByUserIdParamsType = z.TypeOf<typeof getCommentsByUserIdParams>

export const getCommentsByUserIdResponseSchema = z.object({
  message: z.string(),
  data: z.array(commentDocumentSchema.omit({ userId: true })),
  pagination: paginationResponseSchema,
})

export type GetCommentsByUserIdResponseType = z.TypeOf<typeof getCommentsByUserIdResponseSchema>
