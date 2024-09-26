import z from 'zod'
import { movieSchema } from '@/schemas/movies.schema'
import { resPaginationSchema, queryPageSchema } from '@/schemas/common.schema'

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
  results: z.array(movieSchema.extend({ media_type: z.enum(['movie', 'tv']) })),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TrendingTMDBResponseType = z.TypeOf<typeof trendingTMDBResponseSchema>

export const trendingResponseSchema = z.object({
  message: z.string(),
  data: z.array(movieSchema.extend({ media_type: z.enum(['movie', 'tv']) })),
  pagination: resPaginationSchema,
})

export type TrendingResponseType = z.TypeOf<typeof trendingResponseSchema>
