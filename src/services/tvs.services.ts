import http from '@/utils/http'
import envVariables from '@/schemas/env-variables.schema'
import {
  TMDBDiscoverTvResponseType,
  TMDBRecommendedTvsResponseType,
  TMDBTopRatedTvResponseType,
  TMDBTvDetailResponseType,
  TopRatedQueryType,
} from '@/schemas/common-media.schema'
import {
  DiscoverTvsQueryType,
  DiscoverTvsResponseType,
  RecommendedTvsResponseType,
  TopRatedTvsResponseType,
  TvCastType,
  TvCrewType,
  TVDataType,
  TvDetailDataType,
} from '@/schemas/tv.schema'
import favoritesService from '@/services/favorites.services'
import { MovieDataType } from '@/schemas/movies.schema'

class TVsService {
  async discoverTvs(
    payload: DiscoverTvsQueryType & { userId?: string }
  ): Promise<Omit<DiscoverTvsResponseType, 'message'>> {
    const { includeAdult, page, sortBy, voteAverageGte, voteAverageLte, withGenres, userId } = payload

    const response = await http.get<TMDBDiscoverTvResponseType>('/discover/tv', {
      params: {
        page,
        include_adult: includeAdult,
        sort_by: sortBy,
        'vote_average.gte': voteAverageGte,
        'vote_average.lte': voteAverageLte,
        with_genres: withGenres,
      },
    })

    const mediaFavoritesMap = await favoritesService.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: 'tv' })),
      userId,
    })

    return {
      data: response.results.map<TVDataType>(({ backdrop_path, poster_path, ...item }) => {
        const backdropFullPath = backdrop_path ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${backdrop_path}` : null
        const posterFullPath = poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${poster_path}` : null

        return {
          adult: item.adult,
          firstAirDate: item.first_air_date,
          genreIds: item.genre_ids,
          id: item.id,
          mediaType: 'tv',
          name: item.name,
          originalLanguage: item.original_language,
          overview: item.overview,
          originalCountry: item.original_country,
          originalName: item.original_name,
          popularity: item.popularity,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
          backdropPath: backdropFullPath,
          posterPath: posterFullPath,
          isFavorite: userId ? (mediaFavoritesMap[item.id]?.includes('tv') ?? false) : null,
        }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async topRatedTvs({
    page,
    userId,
  }: TopRatedQueryType & { userId?: string }): Promise<Omit<TopRatedTvsResponseType, 'message'>> {
    const response = await http.get<TMDBTopRatedTvResponseType>('/tv/top_rated', { params: { page } })

    const mediaFavoritesMap = await favoritesService.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: 'tv' })),
      userId,
    })

    return {
      data: response.results.map<TVDataType>(({ backdrop_path, poster_path, ...item }) => {
        const backdropFullPath = backdrop_path ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${backdrop_path}` : null
        const posterFullPath = poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${poster_path}` : null

        return {
          adult: item.adult,
          genreIds: item.genre_ids,
          backdropPath: backdropFullPath,
          id: item.id,
          originalLanguage: item.original_language,
          isFavorite: userId ? (mediaFavoritesMap[item.id]?.includes('tv') ?? false) : null,
          originalName: item.original_name,
          overview: item.overview,
          popularity: item.popularity,
          posterPath: posterFullPath,
          firstAirDate: item.first_air_date,
          name: item.name,
          mediaType: 'tv',
          originalCountry: item.original_country,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
        }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async getTvDetail(payload: { tvId: number; userId: string | undefined }): Promise<TvDetailDataType> {
    const { tvId, userId } = payload

    const [response, favoriteRecord] = await Promise.all([
      http.get<TMDBTvDetailResponseType>(`/tv/${tvId}`, {
        params: { append_to_response: 'content_ratings,aggregate_credits,videos' },
      }),
      userId ? favoritesService.getFavorite({ mediaId: tvId, mediaType: 'tv', userId }) : null,
    ])

    const certification = response.content_ratings.results.find((item) => item.iso_3166_1 === 'US')?.rating ?? null

    const formattedCrew = response.aggregate_credits.crew.map<TvCrewType>((item) => {
      const profileFullPath = item.profile_path ? `${envVariables.TMDB_IMAGE_W276_H350_URL}${item.profile_path}` : null

      return {
        adult: item.adult,
        department: item.department,
        gender: item.gender,
        id: item.id,
        jobs: item.jobs.map((job) => ({
          creditId: job.credit_id,
          job: job.job,
          episodeCount: job.episode_count,
        })),
        knownForDepartment: item.known_for_department,
        name: item.name,
        originalName: item.original_name,
        popularity: item.popularity,
        profilePath: profileFullPath,
        totalEpisodeCount: item.total_episode_count,
      }
    })
    const formattedCast = response.aggregate_credits.cast.map<TvCastType>((item) => {
      const profileFullPath = item.profile_path ? `${envVariables.TMDB_IMAGE_W276_H350_URL}${item.profile_path}` : null

      return {
        adult: item.adult,
        gender: item.gender,
        id: item.id,
        knownForDepartment: item.known_for_department,
        name: item.name,
        order: item.order,
        originalName: item.original_name,
        popularity: item.popularity,
        profilePath: profileFullPath,
        roles: item.roles.map((role) => ({
          creditId: role.credit_id,
          character: role.character,
          episodeCount: role.episode_count,
        })),
        totalEpisodeCount: item.total_episode_count,
      }
    })

    const backdropFullPath = response.backdrop_path
      ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${response.backdrop_path}`
      : null
    const posterFullPath = response.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${response.poster_path}` : null

    return {
      adult: response.adult,
      aggregateCredits: {
        cast: formattedCast,
        crew: formattedCrew,
      },
      backdropPath: backdropFullPath,
      certification,
      createdBy: response.created_by.map((item) => ({
        creditId: item.credit_id,
        gender: item.gender,
        id: item.id,
        name: item.name,
        originalName: item.original_name,
        profilePath: item.profile_path,
      })),
      episodeRunTime: response.episode_run_time,
      firstAirDate: response.first_air_date,
      genres: response.genres,
      homepage: response.homepage,
      id: response.id,
      inProduction: response.in_production,
      isFavorite: !userId ? null : Boolean(favoriteRecord),
      languages: response.languages,
      lastAirDate: response.last_air_date,
      lastEpisodeToAir: response.last_episode_to_air
        ? {
            airDate: response.last_episode_to_air.air_date,
            episodeNumber: response.last_episode_to_air.episode_number,
            episodeType: response.last_episode_to_air.episode_type,
            id: response.last_episode_to_air.id,
            name: response.last_episode_to_air.name,
            overview: response.last_episode_to_air.overview,
            productionCode: response.last_episode_to_air.production_code,
            seasonNumber: response.last_episode_to_air.season_number,
            showId: response.last_episode_to_air.show_id,
            stillPath: response.last_episode_to_air.still_path,
            runtime: response.last_episode_to_air.runtime,
            voteAverage: response.last_episode_to_air.vote_average,
            voteCount: response.last_episode_to_air.vote_count,
          }
        : null,
      name: response.name,
      networks: response.networks.map((item) => ({
        id: item.id,
        logoPath: item.logo_path,
        name: item.name,
        originalCountry: item.original_country,
      })),
      nextEpisodeToAir: response.next_episode_to_air
        ? {
            airDate: response.next_episode_to_air.air_date,
            episodeNumber: response.next_episode_to_air.episode_number,
            episodeType: response.next_episode_to_air.episode_type,
            id: response.next_episode_to_air.id,
            name: response.next_episode_to_air.name,
            overview: response.next_episode_to_air.overview,
            productionCode: response.next_episode_to_air.production_code,
            runtime: response.next_episode_to_air.runtime,
            seasonNumber: response.next_episode_to_air.season_number,
            showId: response.next_episode_to_air.show_id,
            stillPath: response.next_episode_to_air.still_path,
            voteAverage: response.next_episode_to_air.vote_average,
            voteCount: response.next_episode_to_air.vote_count,
          }
        : null,
      numberOfEpisodes: response.number_of_episodes,
      numberOfSeasons: response.number_of_seasons,
      originalCountry: response.original_country,
      originalLanguage: response.original_language,
      originalName: response.original_name,
      overview: response.overview,
      popularity: response.popularity,
      posterPath: posterFullPath,
      productionCompanies: response.production_companies.map((item) => ({
        id: item.id,
        logoPath: item.logo_path,
        name: item.name,
        originalCountry: item.original_country,
      })),
      productionCountries: response.production_countries.map((item) => ({
        iso31661: item.iso_3166_1,
        name: item.name,
      })),
      seasons: response.seasons.map((item) => ({
        airDate: item.air_date,
        episodeCount: item.episode_count,
        id: item.id,
        name: item.name,
        overview: item.overview,
        posterPath: item.poster_path,
        seasonNumber: item.season_number,
        voteAverage: item.vote_average,
      })),
      spokenLanguages: response.spoken_languages.map((item) => ({
        englishName: item.english_name,
        iso6391: item.iso_639_1,
        name: item.name,
      })),
      status: response.status,
      type: response.type,
      videos: {
        results: response.videos.results.map((item) => ({
          id: item.id,
          iso6391: item.iso_639_1,
          iso31661: item.iso_3166_1,
          key: item.key,
          name: item.name,
          site: item.site,
          official: item.official,
          publishedAt: item.published_at,
          size: item.size,
          type: item.type,
        })),
      },
      voteAverage: response.vote_average,
      voteCount: response.vote_count,
    }
  }

  async getRecommendedTvs(payload: {
    tvId: number
    userId: string | undefined
  }): Promise<Omit<RecommendedTvsResponseType, 'message'>> {
    const { tvId, userId } = payload

    const [response, favoriteRecord] = await Promise.all([
      http.get<TMDBRecommendedTvsResponseType>(`/tv/${tvId}/recommendations`),
      userId ? favoritesService.getFavorite({ mediaId: tvId, mediaType: 'tv', userId }) : null,
    ])

    const isFavorite = !userId ? null : Boolean(favoriteRecord)

    return {
      data: response.results.map<MovieDataType | TVDataType>((item) => {
        const backdropFullPath = item.backdrop_path
          ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${item.backdrop_path}`
          : null
        const posterFullPath = item.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${item.poster_path}` : null

        return item.media_type === 'movie'
          ? {
              mediaType: 'movie',
              adult: item.adult,
              backdropPath: backdropFullPath,
              genreIds: item.genre_ids,
              id: item.id,
              isFavorite,
              originalLanguage: item.original_language,
              originalTitle: item.original_title,
              overview: item.overview,
              popularity: item.popularity,
              posterPath: posterFullPath,
              releaseDate: item.release_date,
              title: item.title,
              video: item.video,
              voteAverage: item.vote_average,
              voteCount: item.vote_count,
            }
          : {
              mediaType: 'tv',
              adult: item.adult,
              backdropPath: backdropFullPath,
              genreIds: item.genre_ids,
              id: item.id,
              firstAirDate: item.first_air_date,
              isFavorite,
              name: item.name,
              originalCountry: item.original_country,
              originalLanguage: item.original_language,
              overview: item.overview,
              originalName: item.original_name,
              popularity: item.popularity,
              posterPath: posterFullPath,
              voteAverage: item.vote_average,
              voteCount: item.vote_count,
            }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }
}

const tvsService = new TVsService()
export default tvsService
