import http from '@/utils/http'
import envVariables from '@/schemas/env-variables.schema'
import {
  DiscoverQueryType,
  DiscoverParamsType,
  TMDBDiscoverResponseType,
  TrendingParamsType,
  TrendingQueryType,
  TMDBTrendingResponseType,
  TMDBTvTopRatedResponseType,
} from '@/schemas/tmdb.schema'

class TMDBService {
  async discover(payload: DiscoverParamsType & DiscoverQueryType) {
    const { mediaType, includeAdult, includeVideo, page, sortBy, voteAverageGte, voteAverageLte, withGenres } = payload

    const response = await http.get<TMDBDiscoverResponseType>(`/discover/${mediaType}`, {
      params: {
        page,
        include_adult: includeAdult,
        include_video: includeVideo,
        sort_by: sortBy,
        'vote_average.gte': voteAverageGte,
        'vote_average.lte': voteAverageLte,
        with_genres: withGenres,
      },
    })

    return {
      data: response.results.map((item) => {
        const backdropFullPath = item.backdrop_path
          ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${item.backdrop_path}`
          : null
        const posterFullPath = item.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${item.poster_path}` : null

        return { ...item, backdrop_path: backdropFullPath, poster_path: posterFullPath }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async trending(payload: TrendingParamsType & TrendingQueryType) {
    const { timeWindow, trendingType, page } = payload

    const response = await http.get<TMDBTrendingResponseType>(`/trending/${trendingType}/${timeWindow}`, {
      params: { page },
    })

    return {
      data: response.results.map((item) => {
        const backdropFullPath = item.backdrop_path
          ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${item.backdrop_path}`
          : null
        const posterFullPath = item.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${item.poster_path}` : null

        return { ...item, backdrop_path: backdropFullPath, poster_path: posterFullPath }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async tvTopRated(query: TrendingQueryType) {
    const response = await http.get<TMDBTvTopRatedResponseType>('/tv/top_rated', { params: query })

    return {
      data: response.results.map((item) => {
        const backdropFullPath = item.backdrop_path
          ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${item.backdrop_path}`
          : null
        const posterFullPath = item.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${item.poster_path}` : null

        return { ...item, backdrop_path: backdropFullPath, poster_path: posterFullPath }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }
}

const tmdbService = new TMDBService()
export default tmdbService
