import http from '@/utils/http'
import favoritesService from '@/services/favorites.services'
import { TVDataType } from '@/schemas/tmdb-tv.schema'
import envVariables from '@/schemas/env-variables.schema'
import { MovieDataType } from '@/schemas/tmdb-movies.schema'
import {
  TrendingParamsType,
  TrendingQueryType,
  TMDBTrendingResponseType,
  TrendingResponseType,
} from '@/schemas/tmdb.schema'

class TMDBService {
  async trending(
    payload: TrendingParamsType & TrendingQueryType & { userId?: string }
  ): Promise<Omit<TrendingResponseType, 'message'>> {
    const { timeWindow, trendingType, page, userId } = payload

    const response = await http.get<TMDBTrendingResponseType>(`/trending/${trendingType}/${timeWindow}`, {
      params: { page },
    })

    const mediaFavoritesMap = await favoritesService.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: item.media_type })),
      userId,
    })

    return {
      data: response.results.map((item) => {
        const backdropFullPath = item.backdrop_path
          ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${item.backdrop_path}`
          : null
        const posterFullPath = item.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${item.poster_path}` : null

        const data: TVDataType | MovieDataType =
          item.media_type === 'movie'
            ? {
                mediaType: item.media_type,
                adult: item.adult,
                backdropPath: backdropFullPath,
                genreIds: item.genre_ids,
                id: item.id,
                originalLanguage: item.original_language,
                originalTitle: item.original_title,
                isFavorite: userId ? (mediaFavoritesMap[item.id]?.includes(item.media_type) ?? false) : null,
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
                mediaType: item.media_type,
                adult: item.adult,
                backdropPath: backdropFullPath,
                firstAirDate: item.first_air_date,
                genreIds: item.genre_ids,
                id: item.id,
                isFavorite: userId ? (mediaFavoritesMap[item.id]?.includes(item.media_type) ?? false) : null,
                name: item.name,
                originalCountry: item.original_country,
                originalLanguage: item.original_language,
                originalName: item.original_name,
                overview: item.overview,
                popularity: item.popularity,
                posterPath: posterFullPath,
                voteAverage: item.vote_average,
                voteCount: item.vote_count,
              }

        return data
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }
}

const tmdbService = new TMDBService()
export default tmdbService
