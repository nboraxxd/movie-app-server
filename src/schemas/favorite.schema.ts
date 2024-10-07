import z from 'zod'

const favoriteCollectionSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  mediaId: z.number(),
  title: z.string(),
  type: z.enum(['movie', 'tv']),
  posterPath: z.string().nullable(),
  releaseDate: z.string(),
  createdAt: z.date(),
})

export type FavoriteCollectionType = z.TypeOf<typeof favoriteCollectionSchema>

export const addFavoriteBodySchema = z
  .object({
    mediaId: z.number(),
    title: z.string(),
    type: z.enum(['movie', 'tv']),
    posterPath: z.string().nullable(),
    releaseDate: z.string(),
  })
  .strict({ message: 'Additional properties not allowed' })

export type AddFavoriteBodyType = z.TypeOf<typeof addFavoriteBodySchema>

export const addFavoriteResponseSchema = z.object({
  message: z.string(),
  data: z.nullable(favoriteCollectionSchema),
})

export type AddFavoriteResponseType = z.TypeOf<typeof addFavoriteResponseSchema>
