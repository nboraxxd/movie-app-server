import z from 'zod'
import { queryPageSchema } from '@/schemas/common.schema'

/* Common media schema */
export const mediaTypeSchema = z.enum(['movie', 'tv'], { message: 'Invalid media type' })

export type MediaType = z.TypeOf<typeof mediaTypeSchema>

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export type GenreType = z.TypeOf<typeof genreSchema>

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

export const discoverySortBySchema = z.enum(
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

export const pageQuerySchema = z
  .object({
    page: queryPageSchema,
  })
  .strict({ message: 'Additional properties not allowed' })

export type PageQueryType = z.TypeOf<typeof pageQuerySchema>

export const searchQuerySchema = z
  .object({
    page: queryPageSchema,
    query: z.string().min(1, { message: 'Query must be at least 1 character' }),
  })
  .strict({ message: 'Additional properties not allowed' })

export type SearchQueryType = z.TypeOf<typeof searchQuerySchema>

/* Common TMDB schema */
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

const tmdbMovieCastSchema = z.object({
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

const tmdbMovieCrewSchema = z.object({
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

const tmdbTvCastSchema = z.object({
  adult: z.boolean(),
  gender: z.number().nullable(),
  id: z.number(),
  known_for_department: z.string(),
  name: z.string(),
  order: z.number(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
  roles: z.array(
    z.object({
      credit_id: z.string(),
      character: z.string(),
      episode_count: z.number(),
    })
  ),
  total_episode_count: z.number(),
})

const tmdbTvCrewSchema = z.object({
  adult: z.boolean(),
  department: z.string(),
  gender: z.number().nullable(),
  id: z.number(),
  jobs: z.array(
    z.object({
      credit_id: z.string(),
      job: z.string(),
      episode_count: z.number(),
    })
  ),
  known_for_department: z.string(),
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
  total_episode_count: z.number(),
})

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

const tmdbEpisodeToAir = z
  .object({
    id: z.number(),
    name: z.string(),
    overview: z.string(),
    vote_average: z.number(),
    vote_count: z.number(),
    air_date: z.string(),
    episode_number: z.number(),
    episode_type: z.string(),
    production_code: z.string(),
    runtime: z.number(),
    season_number: z.number(),
    show_id: z.number(),
    still_path: z.string().nullable(),
  })
  .nullable()

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

export type TMDBMovieResultType = z.TypeOf<typeof tmdbMovieResultSchema>

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

export type TMDBTvResultType = z.TypeOf<typeof tmdbTvResultSchema>

/* TMDB movie server schema */
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

export const tmdbSearchMoviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(tmdbMovieResultSchema.omit({ media_type: true })),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBSearchMoviesResponseType = z.TypeOf<typeof tmdbSearchMoviesResponseSchema>

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
    cast: z.array(tmdbMovieCastSchema),
    crew: z.array(tmdbMovieCrewSchema),
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
export const tmdbDiscoverTvResponseSchema = tmdbDiscoverMovieResponseSchema.omit({ results: true }).extend({
  results: z.array(tmdbTvResultSchema.omit({ media_type: true })),
})

export type TMDBDiscoverTvResponseType = z.TypeOf<typeof tmdbDiscoverTvResponseSchema>

export const tmdbTopRatedTvResponseSchema = tmdbTopRatedMoviesResponseSchema.omit({ results: true }).extend({
  results: z.array(tmdbTvResultSchema.omit({ media_type: true })),
})

export type TMDBTopRatedTvResponseType = z.TypeOf<typeof tmdbTopRatedTvResponseSchema>

export const tmdbSearchTvsResponseSchema = tmdbSearchMoviesResponseSchema.omit({ results: true }).extend({
  results: z.array(tmdbTvResultSchema.omit({ media_type: true })),
})

export type TMDBSearchTvsResponseType = z.TypeOf<typeof tmdbSearchTvsResponseSchema>

export const tmdbTvDetailResponseSchema = tmdbTvResultSchema.omit({ media_type: true, genre_ids: true }).extend({
  created_by: z.array(
    z.object({
      id: z.number(),
      credit_id: z.string(),
      name: z.string(),
      original_name: z.string(),
      gender: z.number().nullable(),
      profile_path: z.string().nullable(),
    })
  ),
  episode_run_time: z.array(z.number()),
  genres: z.array(tmdbGenreSchema),
  homepage: z.string().nullable(),
  in_production: z.boolean(),
  languages: z.array(z.string()),
  last_air_date: z.string(),
  last_episode_to_air: tmdbEpisodeToAir,
  next_episode_to_air: tmdbEpisodeToAir,
  networks: z.array(
    z.object({
      name: z.string(),
      id: z.number(),
      logo_path: z.string().nullable(),
      original_country: z.string(),
    })
  ),
  number_of_episodes: z.number(),
  number_of_seasons: z.number(),
  production_companies: z.array(tmdbProductionCompanySchema),
  production_countries: z.array(tmdbProductionCountrySchema),
  seasons: z.array(
    z.object({
      air_date: z.string().nullable(),
      episode_count: z.number(),
      id: z.number(),
      name: z.string(),
      overview: z.string(),
      poster_path: z.string().nullable(),
      season_number: z.number(),
      vote_average: z.number(),
    })
  ),
  spoken_languages: z.array(tmdbSpokenLanguageSchema),
  status: z.string(),
  type: z.string(),
  tagline: z.string().nullable(),
  videos: z.object({
    results: z.array(tmdbVideoSchema),
  }),
  content_ratings: z.object({
    results: z.array(
      z.object({
        descriptors: z.array(z.string()),
        iso_3166_1: z.string(),
        rating: z.string(),
      })
    ),
  }),
  aggregate_credits: z.object({
    cast: z.array(tmdbTvCastSchema),
    crew: z.array(tmdbTvCrewSchema),
  }),
})

export type TMDBTvDetailResponseType = z.TypeOf<typeof tmdbTvDetailResponseSchema>

export const tmdbRecommendedTvsResponseSchema = tmdbRecommendedMoviesResponseSchema

export type TMDBRecommendedTvsResponseType = z.TypeOf<typeof tmdbRecommendedTvsResponseSchema>

/* TMDB trending schema */
export const tmdbTrendingResponseSchema = z.object({
  page: z.number(),
  results: z.array(z.union([tmdbMovieResultSchema, tmdbTvResultSchema])),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBTrendingResponseType = z.TypeOf<typeof tmdbTrendingResponseSchema>

/* TMDB people schema */
export const tmdbPersonDetailResponseSchema = z.object({
  adult: z.boolean(),
  also_known_as: z.array(z.string()),
  biography: z.string(),
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  gender: z.number(),
  homepage: z.string().nullable(),
  id: z.number(),
  imdb_id: z.string().nullable(),
  known_for_department: z.string(),
  name: z.string(),
  place_of_birth: z.string().nullable(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
})

export type TMDBPersonDetailResponseType = z.TypeOf<typeof tmdbPersonDetailResponseSchema>

export const tmdbPersonCombinedCreditsResponseSchema = z.object({
  id: z.number(),
  cast: z.array(
    z.union([
      tmdbMovieResultSchema.extend({ character: z.string(), credit_id: z.string(), order: z.number() }),
      tmdbTvResultSchema.extend({ character: z.string(), credit_id: z.string(), episode_count: z.number() }),
    ])
  ),
  crew: z.array(
    z.union([
      tmdbMovieResultSchema.extend({ credit_id: z.string(), department: z.string(), job: z.string() }),
      tmdbTvResultSchema.extend({
        credit_id: z.string(),
        department: z.string(),
        episode_count: z.number(),
        job: z.string(),
      }),
    ])
  ),
})

export type TMDBPersonCombinedCreditsResponseType = z.TypeOf<typeof tmdbPersonCombinedCreditsResponseSchema>
