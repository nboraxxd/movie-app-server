import z from 'zod'
import { ObjectId, WithId } from 'mongodb'

import { userDocumentResponseSchema } from '@/schemas/profile.schema'
import { paginationResponseSchema } from '@/schemas/common.schema'

const reviewDocumentSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  mediaId: z.number(),
  mediaTitle: z.string(),
  mediaType: z.enum(['movie', 'tv']),
  mediaPoster: z.string().nullable(),
  mediaReleaseDate: z.string(),
  content: z.string().min(1).max(1000),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ReviewDocumentType = z.TypeOf<typeof reviewDocumentSchema>

const reviewDataResponseSchema = reviewDocumentSchema
  .omit({ userId: true })
  .merge(z.object({ user: userDocumentResponseSchema.omit({ createdAt: true, updatedAt: true }) }))

export type ReviewDataResponseType = z.TypeOf<typeof reviewDataResponseSchema>

export const addReviewBodySchema = z
  .object({
    mediaId: z.number(),
    mediaTitle: z.string(),
    mediaType: z.enum(['movie', 'tv']),
    mediaPoster: z.string().nullable(),
    mediaReleaseDate: z.string(),
    content: z.string().min(1).max(1000),
  })
  .strict({ message: 'Additional properties not allowed' })

export type AddReviewBodyType = z.TypeOf<typeof addReviewBodySchema>

export const addReviewResponseSchema = z.object({
  message: z.string(),
  data: reviewDataResponseSchema,
})

export type AddReviewResponseType = z.TypeOf<typeof addReviewResponseSchema>

export const getReviewsByMediaParams = z
  .object({
    mediaId: z.coerce.number(),
    mediaType: z.enum(['movie', 'tv']),
  })
  .strict({ message: 'Additional properties not allowed' })

export type GetReviewsByMediaParamsType = z.TypeOf<typeof getReviewsByMediaParams>

export const getReviewsByMediaResponseSchema = z.object({
  message: z.string(),
  data: z.array(reviewDataResponseSchema),
  pagination: paginationResponseSchema,
})

export type GetReviewsByMediaResponseType = z.TypeOf<typeof getReviewsByMediaResponseSchema>

export type AggregatedReviewType = WithId<Omit<GetReviewsByMediaResponseType['data'][number], '_id'>> & {
  user: WithId<Omit<GetReviewsByMediaResponseType['data'][number]['user'], '_id'>>
}

export const getMyReviewsResponseSchema = z.object({
  message: z.string(),
  data: z.array(reviewDocumentSchema.omit({ userId: true })),
  pagination: paginationResponseSchema,
})

export type GetMyReviewsResponseType = z.TypeOf<typeof getMyReviewsResponseSchema>

export const deleteReviewParamsSchema = z.object({
  reviewId: z.string().refine((value) => ObjectId.isValid(value), { message: 'Invalid review id' }),
})

export type DeleteReviewParamsType = z.TypeOf<typeof deleteReviewParamsSchema>
