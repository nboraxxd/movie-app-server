import z from 'zod'
import { queryPageSchema } from '@/schemas/tmdb.schema'

const discoverySortBySchema = z.enum(
  [
    'original_title.asc',
    'original_title.desc',
    'popularity.asc',
    'popularity.desc',
    'revenue.asc',
    'revenue.desc',
    'primary_release_date.asc',
    'primary_release_date.desc',
    'title.asc',
    'title.desc',
    'vote_average.asc',
    'vote_average.desc',
    'vote_count.asc',
    'vote_count.desc',
  ],
  { message: 'Invalid sort by value' }
)

export const discoverTypeSchema = z
  .object({
    discoverType: z.enum(['movie', 'tv'], { message: 'Media type must be movie or tv' }),
  })
  .strict({ message: 'Additional properties not allowed' })

export type DiscoverType = z.TypeOf<typeof discoverTypeSchema>

export const discoverQuerySchema = z
  .object({
    includeAdult: z.boolean().optional(),
    includeVideo: z.boolean().optional(),
    page: queryPageSchema,
    sortBy: discoverySortBySchema.optional(),
    voteAverageGte: z.number().optional(),
    voteAverageLte: z.number().optional(),
    withGenres: z
      .string()
      .regex(/^(\d+)(,\d+)*$/)
      .optional(),
  })
  .strict({ message: 'Additional properties not allowed' })

export type DiscoverQueryType = z.TypeOf<typeof discoverQuerySchema>
