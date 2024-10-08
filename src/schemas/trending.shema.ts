import z from 'zod'
import { tvDataSchema } from '@/schemas/tv.schema'
import { movieDataSchema } from '@/schemas/movies.schema'
import { queryPageSchema, paginationResponseSchema } from '@/schemas/common.schema'

/* Trending schema */
export const trendingParamsSchema = z
  .object({
    trendingType: z.enum(['all', 'movie', 'tv'], { message: 'Media type must be all, movie or tv' }),
    timeWindow: z.enum(['day', 'week'], { message: 'Time window must be day or week' }).default('day'),
  })
  .strict({ message: 'Additional properties not allowed' })

export type TrendingParamsType = z.TypeOf<typeof trendingParamsSchema>

export const trendingQuerySchema = z
  .object({
    page: queryPageSchema,
  })
  .strict({ message: 'Additional properties not allowed' })

export type TrendingQueryType = z.TypeOf<typeof trendingQuerySchema>

export const trendingResponseSchema = z.object({
  message: z.string(),
  data: z.array(z.union([movieDataSchema, tvDataSchema])),
  pagination: paginationResponseSchema,
})

export type TrendingResponseType = z.TypeOf<typeof trendingResponseSchema>
