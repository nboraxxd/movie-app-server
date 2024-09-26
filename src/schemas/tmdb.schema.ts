import z from 'zod'
import { queryPageSchema, paginationResponseSchema } from '@/schemas/common.schema'

/* TMDB schema */
export const commonResultTMDBResponse = z.object({
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

export type CommonResultTMDBType = z.TypeOf<typeof commonResultTMDBResponse>

/* Discover schema */
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
    mediaType: z.enum(['movie', 'tv'], { message: 'Media type must be movie or tv' }),
  })
  .strict({ message: 'Additional properties not allowed' })

export type DiscoverParamsType = z.TypeOf<typeof discoverParamsSchema>

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
  results: z.array(commonResultTMDBResponse),
  total_pages: z.number(),
  total_results: z.number(),
})

export type DiscoverTMDBResponseType = z.TypeOf<typeof discoverTMDBResponseSchema>

export const discoverResponseSchema = z.object({
  message: z.string(),
  data: z.array(commonResultTMDBResponse),
  pagination: paginationResponseSchema,
})

export type DiscoverResponseType = z.TypeOf<typeof discoverResponseSchema>

/* Trending schema */
export const trendingParamsSchema = z
  .object({
    trendingType: z.enum(['all', 'movie', 'tv'], { message: 'Media type must be all, movie or tv' }).default('all'),
    timeWindow: z.enum(['day', 'week'], { message: 'Time window must be day or week' }).default('day'),
  })
  .strict({ message: 'Additional properties not allowed' })

export type TrendingParamsType = z.TypeOf<typeof trendingParamsSchema>

export const trendingQuerySchema = z.object({
  page: queryPageSchema,
})

export type TrendingQueryType = z.TypeOf<typeof trendingQuerySchema>

// total_pages và total_results dùng snake_case vì dữ liệu trả về từ TMDB có dạng snake_case
export const trendingTMDBResponseSchema = z.object({
  page: z.number(),
  results: z.array(commonResultTMDBResponse.extend({ media_type: z.enum(['movie', 'tv']) })),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TrendingTMDBResponseType = z.TypeOf<typeof trendingTMDBResponseSchema>

export const trendingResponseSchema = z.object({
  message: z.string(),
  data: z.array(commonResultTMDBResponse.extend({ media_type: z.enum(['movie', 'tv']) })),
  pagination: paginationResponseSchema,
})

export type TrendingResponseType = z.TypeOf<typeof trendingResponseSchema>
