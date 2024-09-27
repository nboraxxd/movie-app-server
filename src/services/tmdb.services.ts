import http from '@/utils/http'
import envVariables from '@/schemas/env-variables.schema'
import {
  DiscoverQueryType,
  DiscoverParamsType,
  TMDBDiscoverResponseType,
  TrendingParamsType,
  TrendingQueryType,
  TMDBTrendingResponseType,
  TMDBTopRatedResponseType,
  TopRatedParamsType,
  TopRatedQueryType,
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

  async topRated({ topRatedType, page }: TopRatedParamsType & TopRatedQueryType) {
    const response = await http.get<TMDBTopRatedResponseType>(`/${topRatedType}/top_rated`, { params: { page } })

    return {
      data: response.results.map((item) => {
        const {
          first_air_date,
          name,
          origin_country,
          original_name,
          original_title,
          release_date,
          title,
          video,
          backdrop_path,
          poster_path,
          ...rest
        } = item

        const backdropFullPath = backdrop_path ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${backdrop_path}` : null
        const posterFullPath = poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${poster_path}` : null

        return topRatedType === 'movie'
          ? {
              original_title,
              release_date,
              title,
              video,
              backdrop_path: backdropFullPath,
              poster_path: posterFullPath,
              media_type: topRatedType,
              ...rest,
            }
          : {
              first_air_date,
              name,
              origin_country,
              original_name,
              backdrop_path: backdropFullPath,
              poster_path: posterFullPath,
              media_type: topRatedType,
              ...rest,
            }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }
}

const tmdbService = new TMDBService()
export default tmdbService
