import z from 'zod'
import { paginationResponseSchema } from '@/schemas/common.schema'

/* Common schema */
export const tvDataSchema = z.object({
  adult: z.boolean(),
  backdropPath: z.string().nullable(),
  firstAirDate: z.string(),
  genreIds: z.array(z.number()),
  id: z.number(),
  mediaType: z.literal('tv'),
  name: z.string(),
  originalCountry: z.array(z.string()),
  originalLanguage: z.string(),
  originalName: z.string(),
  overview: z.string(),
  popularity: z.number(),
  posterPath: z.string().nullable(),
  voteAverage: z.number(),
  voteCount: z.number(),
  isFavorite: z.boolean().nullable(),
})

export type TVDataType = z.TypeOf<typeof tvDataSchema>

/* Discover tv schema */
export const discoverTvResponseSchema = z.object({
  message: z.string(),
  data: z.array(tvDataSchema.omit({ mediaType: true })),
  pagination: paginationResponseSchema,
})

export type DiscoverTvResponseType = z.TypeOf<typeof discoverTvResponseSchema>

/* Top rated tv schema */
export const topRatedTvResponseSchema = discoverTvResponseSchema

export type TopRatedTvResponseType = z.TypeOf<typeof topRatedTvResponseSchema>
