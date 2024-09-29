import omit from 'lodash/omit'

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
  TMDBMovieDetailResponseType,
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

  async getMovieDetail(movieId: number) {
    const response = await http.get<TMDBMovieDetailResponseType>(`/movie/${movieId}`, {
      params: { append_to_response: 'release_dates,credits,videos' },
    })

    const certification =
      response.release_dates.results.find((item) => item.iso_3166_1 === 'US')?.release_dates[0].certification || null

    const formattedCrew = response.credits.crew.map((item) => {
      const profileFullPath = item.profile_path ? `${envVariables.TMDB_IMAGE_W276_H350_URL}${item.profile_path}` : null
      return { ...item, profile_path: profileFullPath }
    })
    const formattedCast = response.credits.cast.map((item) => {
      const profileFullPath = item.profile_path ? `${envVariables.TMDB_IMAGE_W276_H350_URL}${item.profile_path}` : null
      return { ...item, profile_path: profileFullPath }
    })

    const backdropFullPath = response.backdrop_path
      ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${response.backdrop_path}`
      : null
    const posterFullPath = response.poster_path
      ? `${envVariables.TMDB_IMAGE_W600_H900_URL}${response.poster_path}`
      : null

    return {
      ...omit(response, ['release_dates']),
      credits: { crew: formattedCrew, cast: formattedCast },
      certification,
      backdrop_path: backdropFullPath,
      poster_path: posterFullPath,
    }
  }
}

const tmdbService = new TMDBService()
export default tmdbService
