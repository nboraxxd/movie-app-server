import z from 'zod'
import { commonResultTMDB, queryPageSchema } from '@/schemas/tmdb.schema'
import { resPaginationSchema } from '@/schemas/common.schema'

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

export const discoverParamsSchema = z
  .object({
    discoverType: z.enum(['movie', 'tv'], { message: 'Media type must be movie or tv' }),
  })
  .strict({ message: 'Additional properties not allowed' })

export type DiscoverParams = z.TypeOf<typeof discoverParamsSchema>

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

// total_pages và total_results dùng snake_case vì dữ liệu trả về từ TMDB có dạng snake_case
export const discoverTMDBResponseSchema = z.object({
  page: z.number(),
  results: z.array(commonResultTMDB),
  total_pages: z.number(),
  total_results: z.number(),
})

export type DiscoverTMDBResponseType = z.TypeOf<typeof discoverTMDBResponseSchema>

export const discoverResponseSchema = z.object({
  message: z.string(),
  data: z.array(commonResultTMDB),
  pagination: resPaginationSchema,
})

export type DiscoverResponseType = z.TypeOf<typeof discoverResponseSchema>
