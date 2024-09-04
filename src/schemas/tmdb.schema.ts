import z from 'zod'
import { movieSchema } from '@/schemas/movies.schema'

export const popularMoviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

export type PopularMoviesResponseType = z.TypeOf<typeof popularMoviesResponseSchema>
