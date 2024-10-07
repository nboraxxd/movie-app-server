import z from 'zod'
import { queryPageSchema, paginationResponseSchema } from '@/schemas/common.schema'
import { movieDataSchema } from '@/schemas/tmdb-movies.schema'
import { tvDataSchema } from '@/schemas/tmdb-tv.schema'

/* Common schema */
export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const productionCompanySchema = z.object({
  id: z.number(),
  logoPath: z.string().nullable(),
  name: z.string(),
  originalCountry: z.string(),
})

export type ProductionCompanyType = z.TypeOf<typeof productionCompanySchema>

export const productionCountrySchema = z.object({
  iso31661: z.string(),
  name: z.string(),
})

export type ProductionCountryType = z.TypeOf<typeof productionCountrySchema>

export const spokenLanguageSchema = z.object({
  englishName: z.string(),
  iso6391: z.string(),
  name: z.string(),
})

export type SpokenLanguageType = z.TypeOf<typeof spokenLanguageSchema>

export const castSchema = z.object({
  adult: z.boolean(),
  gender: z.number().nullable(),
  id: z.number(),
  knownForDepartment: z.string(),
  name: z.string(),
  originalName: z.string(),
  popularity: z.number(),
  profilePath: z.string().nullable(),
  castId: z.number(),
  character: z.string(),
  creditId: z.string(),
  order: z.number(),
})

export type CastType = z.TypeOf<typeof castSchema>

export const crewSchema = z.object({
  adult: z.boolean(),
  gender: z.number().nullable(),
  id: z.number(),
  knownForDepartment: z.string(),
  name: z.string(),
  originalName: z.string(),
  popularity: z.number(),
  profilePath: z.string().nullable(),
  creditId: z.string(),
  department: z.string(),
  job: z.string(),
})

export type CrewType = z.TypeOf<typeof crewSchema>

export const videoSchema = z.object({
  iso6391: z.string(),
  iso31661: z.string(),
  name: z.string(),
  key: z.string(),
  site: z.string(),
  size: z.number(),
  type: z.string(),
  official: z.boolean(),
  publishedAt: z.string(),
  id: z.string(),
})

export type VideoType = z.TypeOf<typeof videoSchema>

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

export const discoverQuerySchema = z
  .object({
    includeAdult: z
      .string()
      .refine((value) => value === 'true' || value === 'false', { message: 'includeAdult must be true or false' })
      .optional(),
    includeVideo: z
      .string()
      .refine((value) => value === 'true' || value === 'false', { message: 'includeVideo must be true or false' })
      .optional(),
    page: queryPageSchema,
    sortBy: discoverySortBySchema.optional(),
    voteAverageGte: z.coerce.number().optional(),
    voteAverageLte: z.coerce.number().optional(),
    withGenres: z
      .string()
      .regex(/^(\d+)(,\d+)*$/)
      .optional(),
  })
  .strict({ message: 'Additional properties not allowed' })

export type DiscoverQueryType = z.TypeOf<typeof discoverQuerySchema>

export const topRatedQuerySchema = z
  .object({
    page: queryPageSchema,
  })
  .strict({ message: 'Additional properties not allowed' })

export type TopRatedQueryType = z.TypeOf<typeof topRatedQuerySchema>

/* TMDB server common schema */
const tmdbGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export type TMDBGenreType = z.TypeOf<typeof tmdbGenreSchema>

const tmdbProductionCompanySchema = z.object({
  id: z.number(),
  logo_path: z.string().nullable(),
  name: z.string(),
  original_country: z.string(),
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

export const tmdbTvResultSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  first_air_date: z.string(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  media_type: z.literal('tv'),
  name: z.string(),
  original_country: z.array(z.string()),
  original_language: z.string(),
  original_name: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
})

/* TMDB movie server schema */
export type TMDBMovieResultType = z.TypeOf<typeof tmdbMovieResultSchema>

export const tmdbDiscoverMovieResponseSchema = z.object({
  page: z.number(),
  results: z.array(tmdbMovieResultSchema.omit({ media_type: true })),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBDiscoverMovieResponseType = z.TypeOf<typeof tmdbDiscoverMovieResponseSchema>

export const tmdbTopRatedMoviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(tmdbMovieResultSchema.omit({ media_type: true })),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBTopRatedMoviesResponseType = z.TypeOf<typeof tmdbTopRatedMoviesResponseSchema>

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
  original_country: z.array(z.string()),
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

export const tmdbRecommendedMoviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(z.union([tmdbMovieResultSchema, tmdbTvResultSchema])),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBRecommendedMoviesResponseType = z.TypeOf<typeof tmdbRecommendedMoviesResponseSchema>

/* TMDB tv server schema */
export type TMDBTvResultType = z.TypeOf<typeof tmdbTvResultSchema>

export const tmdbDiscoverTvResponseSchema = tmdbDiscoverMovieResponseSchema.omit({ results: true }).extend({
  results: z.array(tmdbTvResultSchema.omit({ media_type: true })),
})

export type TMDBDiscoverTvResponseType = z.TypeOf<typeof tmdbDiscoverTvResponseSchema>

export const tmdbTopRatedTvResponseSchema = tmdbTopRatedMoviesResponseSchema.omit({ results: true }).extend({
  results: z.array(tmdbTvResultSchema.omit({ media_type: true })),
})

export type TMDBTopRatedTvResponseType = z.TypeOf<typeof tmdbTopRatedTvResponseSchema>

// const tmdbTvCastSchema = tmdbCastSchema.omit({ cast_id: true })

/* Trending schema */
export const tmdbTrendingResponseSchema = z.object({
  page: z.number(),
  results: z.array(z.union([tmdbMovieResultSchema, tmdbTvResultSchema])),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBTrendingResponseType = z.TypeOf<typeof tmdbTrendingResponseSchema>

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
