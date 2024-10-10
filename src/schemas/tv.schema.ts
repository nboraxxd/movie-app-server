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
export const discoverTvsResponseSchema = z.object({
  message: z.string(),
  data: z.array(tvDataSchema),
  pagination: paginationResponseSchema,
})

export type DiscoverTvsResponseType = z.TypeOf<typeof discoverTvsResponseSchema>

/* Top rated tv schema */
export const topRatedTvsResponseSchema = discoverTvsResponseSchema

export type TopRatedTvsResponseType = z.TypeOf<typeof topRatedTvsResponseSchema>
