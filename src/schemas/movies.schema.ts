import z from 'zod'

export const movieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
})

export type MovieType = z.TypeOf<typeof movieSchema>

export const moviesQuerySchema = z.object({
  page: z.coerce
    .number({ message: 'Page must be a number' })
    .int({ message: 'Page must be an integer' })
    .positive({ message: 'Page must be a positive number' })
    .optional(),
})

export type MoviesQueryType = z.TypeOf<typeof moviesQuerySchema>

export const moviesResponseSchema = z.object({
  message: z.string(),
  data: z.array(movieSchema),
  pagination: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    count: z.number(),
  }),
})

export type MoviesResponseType = z.TypeOf<typeof moviesResponseSchema>
