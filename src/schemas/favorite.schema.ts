import z from 'zod'
import { ObjectId } from 'mongodb'

const favoriteDocumentSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  mediaId: z.number(),
  mediaTitle: z.string(),
  mediaType: z.enum(['movie', 'tv']),
  mediaPoster: z.string().nullable(),
  mediaReleaseDate: z.string(),
  createdAt: z.date(),
})

export type FavoriteDocumentType = z.TypeOf<typeof favoriteDocumentSchema>

export const addFavoriteBodySchema = z
  .object({
    mediaId: z.number(),
    mediaTitle: z.string(),
    mediaType: z.enum(['movie', 'tv']),
    mediaPoster: z.string().nullable(),
    mediaReleaseDate: z.string(),
  })
  .strict({ message: 'Additional properties not allowed' })

export type AddFavoriteBodyType = z.TypeOf<typeof addFavoriteBodySchema>

export const addFavoriteResponseSchema = z.object({
  message: z.string(),
  data: z.nullable(favoriteDocumentSchema),
})

export type AddFavoriteResponseType = z.TypeOf<typeof addFavoriteResponseSchema>

export const getMyFavoritesResponseSchema = z.object({
  message: z.string(),
  data: z.array(favoriteDocumentSchema.omit({ userId: true })),
  hasNextPage: z.boolean(),
})

export type GetMyFavoritesResponseType = z.TypeOf<typeof getMyFavoritesResponseSchema>

export const deleteFavoriteByIdParamsSchema = z.object({
  favoriteId: z.string().refine((value) => ObjectId.isValid(value), { message: 'Invalid favorite id' }),
})

export type DeleteFavoriteByIdParamsType = z.TypeOf<typeof deleteFavoriteByIdParamsSchema>

export const favoriteByMediaParamsSchema = z
  .object({
    mediaId: z.coerce.number(),
    mediaType: z.enum(['movie', 'tv']),
  })
  .strict({ message: 'Additional properties not allowed' })

export type FavoriteByMediaParamsType = z.TypeOf<typeof favoriteByMediaParamsSchema>

export const checkFavoriteByMediaResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    isFavorite: z.boolean(),
  }),
})

export type CheckFavoriteByMediaResponseType = z.TypeOf<typeof checkFavoriteByMediaResponseSchema>
