import z from 'zod'

export const favoriteBodySchema = z
  .object({
    mediaId: z.number(),
    title: z.string(),
    type: z.enum(['movie', 'tv']),
    posterPath: z.string(),
    backdropPath: z.string(),
    releaseDate: z.string(),
    voteAverage: z.number(),
  })
  .strict({ message: 'Additional properties not allowed' })

export type FavoriteBodyType = z.TypeOf<typeof favoriteBodySchema>
