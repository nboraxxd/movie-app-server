import z from 'zod'

import {
  discoverySortBySchema,
  genreSchema,
  productionCompanySchema,
  productionCountrySchema,
  spokenLanguageSchema,
  videoSchema,
} from '@/schemas/common-media.schema'
import { movieDataSchema } from '@/schemas/movies.schema'
import { paginationResponseSchema, queryPageSchema } from '@/schemas/common.schema'

/* Common schema */
export const tvCastSchema = z.object({
  adult: z.boolean(),
  gender: z.number().nullable(),
  id: z.number(),
  knownForDepartment: z.string(),
  name: z.string(),
  order: z.number(),
  originalName: z.string(),
  popularity: z.number(),
  profilePath: z.string().nullable(),
  roles: z.array(
    z.object({
      creditId: z.string(),
      character: z.string(),
      episodeCount: z.number(),
    })
  ),
  totalEpisodeCount: z.number(),
})

export type TvCastType = z.TypeOf<typeof tvCastSchema>

export const tvCrewSchema = z.object({
  adult: z.boolean(),
  department: z.string(),
  gender: z.number().nullable(),
  id: z.number(),
  jobs: z.array(
    z.object({
      creditId: z.string(),
      job: z.string(),
      episodeCount: z.number(),
    })
  ),
  knownForDepartment: z.string(),
  name: z.string(),
  originalName: z.string(),
  popularity: z.number(),
  profilePath: z.string().nullable(),
  totalEpisodeCount: z.number(),
})

export type TvCrewType = z.TypeOf<typeof tvCrewSchema>

export const episodeToAir = z
  .object({
    id: z.number(),
    name: z.string(),
    overview: z.string(),
    voteAverage: z.number(),
    voteCount: z.number(),
    airDate: z.string(),
    episodeNumber: z.number(),
    episodeType: z.string(),
    productionCode: z.string(),
    runtime: z.number(),
    seasonNumber: z.number(),
    showId: z.number(),
    stillPath: z.string().nullable(),
  })
  .nullable()

export const tvDataSchema = z.object({
  adult: z.boolean(),
  backdropPath: z.string().nullable(),
  firstAirDate: z.string(),
  genreIds: z.array(z.number()),
  id: z.number(),
  mediaType: z.literal('tv'),
  name: z.string(),
  originCountry: z.array(z.string()),
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

export const tvDetailDataSchema = tvDataSchema.omit({ mediaType: true, genreIds: true }).extend({
  createdBy: z.array(
    z.object({
      id: z.number(),
      creditId: z.string(),
      name: z.string(),
      originalName: z.string(),
      gender: z.number().nullable(),
      profilePath: z.string().nullable(),
    })
  ),
  episodeRunTime: z.array(z.number()),
  genres: z.array(genreSchema),
  homepage: z.string().nullable(),
  inProduction: z.boolean(),
  languages: z.array(z.string()),
  lastAirDate: z.string(),
  lastEpisodeToAir: episodeToAir,
  nextEpisodeToAir: episodeToAir,
  networks: z.array(
    z.object({
      id: z.number(),
      logoPath: z.string().nullable(),
      name: z.string(),
      originCountry: z.string(),
    })
  ),
  numberOfEpisodes: z.number(),
  numberOfSeasons: z.number(),
  productionCompanies: z.array(productionCompanySchema),
  productionCountries: z.array(productionCountrySchema),
  seasons: z.array(
    z.object({
      airDate: z.string().nullable(),
      episodeCount: z.number(),
      id: z.number(),
      name: z.string(),
      overview: z.string(),
      posterPath: z.string().nullable(),
      seasonNumber: z.number(),
      voteAverage: z.number(),
    })
  ),
  spokenLanguages: z.array(spokenLanguageSchema),
  status: z.string(),
  type: z.string(),
  videos: z.object({
    results: z.array(videoSchema),
  }),
  aggregateCredits: z.object({
    cast: z.array(tvCastSchema),
    crew: z.array(tvCrewSchema),
  }),
  certification: z.string().nullable(),
})

export type TvDetailDataType = z.TypeOf<typeof tvDetailDataSchema>

/* Discover tv schema */
export const discoverTvsQuerySchema = z
  .object({
    includeAdult: z
      .number()
      .refine((value) => value === 0 || value === 1, { message: 'includeAdult must be 0 (false) or 1 (true)' })
      .optional(),
    page: queryPageSchema.optional(),
    sortBy: discoverySortBySchema.optional(),
    voteAverageGte: z.coerce.number().optional(),
    voteAverageLte: z.coerce.number().optional(),
    withGenres: z
      .string()
      .regex(/^(\d+)(,\d+)*$/)
      .optional(),
  })
  .strict({ message: 'Additional properties not allowed' })

export type DiscoverTvsQueryType = z.TypeOf<typeof discoverTvsQuerySchema>

export const discoverTvsResponseSchema = z.object({
  message: z.string(),
  data: z.array(tvDataSchema),
  pagination: paginationResponseSchema,
})

export type DiscoverTvsResponseType = z.TypeOf<typeof discoverTvsResponseSchema>

/* Top rated tv schema */
export const topRatedTvsResponseSchema = discoverTvsResponseSchema

export type TopRatedTvsResponseType = z.TypeOf<typeof topRatedTvsResponseSchema>

/* Search tv schema */
export const searchTvsResponseSchema = discoverTvsResponseSchema

export type SearchTvsResponseType = z.TypeOf<typeof searchTvsResponseSchema>

/* Tv detail schema */
export const tvIdParamsSchema = z.object({
  tvId: z.coerce.number({ message: 'Tv ID must be a number' }).int({ message: 'Tv ID must be an integer' }),
})

export type TvIdParamsType = z.TypeOf<typeof tvIdParamsSchema>

export const tvDetailResponseSchema = z.object({
  message: z.string(),
  data: tvDetailDataSchema,
})

export type TvDetailResponseType = z.TypeOf<typeof tvDetailResponseSchema>

/* Recommended tvs schema */
export const recommendedTvsResponseSchema = z.object({
  message: z.string(),
  data: z.array(z.union([movieDataSchema, tvDataSchema])),
  pagination: paginationResponseSchema,
})

export type RecommendedTvsResponseType = z.TypeOf<typeof recommendedTvsResponseSchema>
