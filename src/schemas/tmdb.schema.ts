import z from 'zod'
import { queryPageSchema, paginationResponseSchema } from '@/schemas/common.schema'

/* TMDB schema */
const tmdbGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export type TMDBGenreType = z.TypeOf<typeof tmdbGenreSchema>

const tmdbProductionCompanySchema = z.object({
  id: z.number(),
  logo_path: z.string().nullable(),
  name: z.string(),
  origin_country: z.string(),
})

const tmdbProductionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
})

const tmdbSpokenLanguageSchema = z.object({
  english_name: z.string(),
  iso_639_1: z.string(),
  name: z.string(),
})

const tmdbCastSchema = z.object({
  adult: z.boolean(),
  gender: z.number().nullable(),
  id: z.number(),
  known_for_department: z.string(),
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
  cast_id: z.number(),
  character: z.string(),
  credit_id: z.string(),
  order: z.number(),
})

const tmdbCrewSchema = z.object({
  adult: z.boolean(),
  gender: z.number().nullable(),
  id: z.number(),
  known_for_department: z.string(),
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
  credit_id: z.string(),
  department: z.string(),
  job: z.string(),
})

export type TMDBCrewType = z.TypeOf<typeof tmdbCrewSchema>

const tmdbVideoSchema = z.object({
  iso_639_1: z.string(),
  iso_3166_1: z.string(),
  name: z.string(),
  key: z.string(),
  site: z.string(),
  size: z.number(),
  type: z.string(),
  official: z.boolean(),
  published_at: z.string(),
  id: z.string(),
})

const tmdbReleaseDateSchema = z.object({
  iso_3166_1: z.string(),
  release_dates: z.array(
    z.object({
      certification: z.string(),
      descriptors: z.array(z.string()),
      iso_639_1: z.string(),
      note: z.string(),
      release_date: z.string(),
      type: z.number(),
    })
  ),
})

export const tmdbMovieResultSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  media_type: z.literal('movie'),
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

// const tmdbTvCastSchema = tmdbCastSchema.omit({ cast_id: true })

export const tmdbTvResultSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  first_air_date: z.string(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  media_type: z.literal('tv'),
  name: z.string(),
  origin_country: z.array(z.string()),
  original_language: z.string(),
  original_name: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
})

export const tmdbMovieDetailResponseSchema = tmdbMovieResultSchema.omit({ media_type: true, genre_ids: true }).extend({
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string().nullable(),
      backdrop_path: z.string().nullable(),
    })
    .nullable(),
  budget: z.number(),
  genres: z.array(tmdbGenreSchema),
  homepage: z.string().nullable(),
  imdb_id: z.string().nullable(),
  origin_country: z.array(z.string()),
  production_companies: z.array(tmdbProductionCompanySchema),
  production_countries: z.array(tmdbProductionCountrySchema),
  revenue: z.number(),
  runtime: z.number().nullable(),
  spoken_languages: z.array(tmdbSpokenLanguageSchema),
  status: z.string(),
  tagline: z.string().nullable(),
  credits: z.object({
    cast: z.array(tmdbCastSchema),
    crew: z.array(tmdbCrewSchema),
  }),
  videos: z.object({
    results: z.array(tmdbVideoSchema),
  }),
  release_dates: z.object({
    results: z.array(tmdbReleaseDateSchema),
  }),
})

export type TMDBMovieDetailResponseType = z.TypeOf<typeof tmdbMovieDetailResponseSchema>

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
export const tmdbDiscoverResponseSchema = z.object({
  page: z.number(),
  results: z.array(tmdbMovieResultSchema.omit({ media_type: true })),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBDiscoverResponseType = z.TypeOf<typeof tmdbDiscoverResponseSchema>

export const discoverResponseSchema = z.object({
  message: z.string(),
  data: tmdbDiscoverResponseSchema.shape.results,
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

export const trendingQuerySchema = z
  .object({
    page: queryPageSchema,
  })
  .strict({ message: 'Additional properties not allowed' })

export type TrendingQueryType = z.TypeOf<typeof trendingQuerySchema>

// total_pages và total_results dùng snake_case vì dữ liệu trả về từ TMDB có dạng snake_case
export const tmdbTrendingResponseSchema = z.object({
  page: z.number(),
  results: z.array(z.union([tmdbMovieResultSchema, tmdbTvResultSchema])),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBTrendingResponseType = z.TypeOf<typeof tmdbTrendingResponseSchema>

export const trendingResponseSchema = z.object({
  message: z.string(),
  data: tmdbTrendingResponseSchema.shape.results,
  pagination: paginationResponseSchema,
})

export type TrendingResponseType = z.TypeOf<typeof trendingResponseSchema>

/* Top Rated schema */
export const topRatedParamsSchema = z
  .object({
    topRatedType: z.enum(['movie', 'tv'], { message: 'Media type must be movie or tv' }).default('movie'),
  })
  .strict({ message: 'Additional properties not allowed' })

export type TopRatedParamsType = z.TypeOf<typeof topRatedParamsSchema>

export const topRatedQuerySchema = z
  .object({
    page: queryPageSchema,
  })
  .strict({ message: 'Additional properties not allowed' })

export type TopRatedQueryType = z.TypeOf<typeof topRatedQuerySchema>

export const tmdbTopRatedResponseSchema = z.object({
  page: z.number(),
  results: z.array(
    tmdbMovieResultSchema.omit({ media_type: true }).merge(tmdbTvResultSchema.omit({ media_type: true }))
  ),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBTopRatedResponseType = z.TypeOf<typeof tmdbTopRatedResponseSchema>

export const topRatedResponseSchema = z.object({
  message: z.string(),
  data: z.array(z.union([tmdbMovieResultSchema, tmdbTvResultSchema])),
  pagination: paginationResponseSchema,
})

export type TopRatedResponseType = z.TypeOf<typeof topRatedResponseSchema>

/* Movies schema */
export const movieParamsSchema = z.object({
  movieId: z.coerce.number({ message: 'Movie ID must be a number' }).int({ message: 'Movie ID must be an integer' }),
})

export type MovieParamsType = z.TypeOf<typeof movieParamsSchema>

export const movieDetailResponseSchema = z.object({
  message: z.string(),
  data: tmdbMovieDetailResponseSchema.omit({ release_dates: true }).extend({
    certification: z.string().nullable(),
  }),
})

export type MovieDetailResponseType = z.TypeOf<typeof movieDetailResponseSchema>

export const tmdbMovieRecommendationsResponseSchema = z.object({
  page: z.number(),
  results: z.array(z.union([tmdbMovieResultSchema, tmdbTvResultSchema])),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBMovieRecommendationsResponseType = z.TypeOf<typeof tmdbMovieRecommendationsResponseSchema>

export const recommendedMoviesResponseSchema = z.object({
  message: z.string(),
  data: tmdbMovieRecommendationsResponseSchema.shape.results,
  pagination: paginationResponseSchema,
})

export type RecommendedMoviesResponseType = z.TypeOf<typeof recommendedMoviesResponseSchema>
