import omit from 'lodash/omit'
import { ObjectId } from 'mongodb'

import http from '@/utils/http'
import envVariables from '@/schemas/env-variables.schema'
import databaseService from '@/services/database.services'
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
  TMDBMovieRecommendationsResponseType,
} from '@/schemas/tmdb.schema'

class TMDBService {
  async getMediaFavoritesMap(payload: { medias: Array<{ id: number; type: 'movie' | 'tv' }>; userId?: string }) {
    const { medias, userId } = payload

    const mediaFavoritesMap: Record<number, Array<'movie' | 'tv'>> = {}

    if (userId) {
      const favoriteRecords = await databaseService.favorites
        .find(
          {
            user_id: new ObjectId(userId),
            $or: medias.map((media) => ({
              media_id: media.id,
              type: media.type,
            })),
          },
          { projection: { media_id: 1, type: 1 } }
        )
        .toArray()

      for (const { media_id, type } of favoriteRecords) {
        if (media_id in mediaFavoritesMap) {
          mediaFavoritesMap[media_id].push(type)
        } else {
          mediaFavoritesMap[media_id] = [type]
        }
      }
    }

    return mediaFavoritesMap
  }

  async discover(payload: DiscoverParamsType & DiscoverQueryType & { userId?: string }) {
    const { mediaType, includeAdult, includeVideo, page, sortBy, voteAverageGte, voteAverageLte, withGenres, userId } =
      payload

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

    const mediaFavoritesMap = await this.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: mediaType })),
      userId,
    })

    return {
      data: response.results.map((item) => {
        const backdropFullPath = item.backdrop_path
          ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${item.backdrop_path}`
          : null
        const posterFullPath = item.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${item.poster_path}` : null

        return {
          ...item,
          backdrop_path: backdropFullPath,
          poster_path: posterFullPath,
          is_favorite: userId ? (mediaFavoritesMap[item.id]?.includes(mediaType) ?? false) : null,
        }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async trending(payload: TrendingParamsType & TrendingQueryType & { userId?: string }) {
    const { timeWindow, trendingType, page, userId } = payload

    const response = await http.get<TMDBTrendingResponseType>(`/trending/${trendingType}/${timeWindow}`, {
      params: { page },
    })

    const mediaFavoritesMap = await this.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: item.media_type })),
      userId,
    })

    console.log(mediaFavoritesMap)
    return {
      data: response.results.map((item) => {
        const backdropFullPath = item.backdrop_path
          ? `${envVariables.TMDB_IMAGE_ORIGINAL_URL}${item.backdrop_path}`
          : null
        const posterFullPath = item.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${item.poster_path}` : null

        return {
          ...item,
          backdrop_path: backdropFullPath,
          poster_path: posterFullPath,
          is_favorite: userId ? (mediaFavoritesMap[item.id]?.includes(item.media_type) ?? false) : null,
        }
      }),
      pagination: { currentPage: response.page, totalPages: response.total_pages, count: response.total_results },
    }
  }

  async topRated({ topRatedType, page, userId }: TopRatedParamsType & TopRatedQueryType & { userId?: string }) {
    const response = await http.get<TMDBTopRatedResponseType>(`/${topRatedType}/top_rated`, { params: { page } })

    const mediaFavoritesMap = await this.getMediaFavoritesMap({
      medias: response.results.map((item) => ({ id: item.id, type: topRatedType })),
      userId,
    })

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
              is_favorite: userId ? (mediaFavoritesMap[item.id]?.includes(topRatedType) ?? false) : null,
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
              is_favorite: userId ? (mediaFavoritesMap[item.id]?.includes(topRatedType) ?? false) : null,
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
    const posterFullPath = response.poster_path ? `${envVariables.TMDB_IMAGE_W500_URL}${response.poster_path}` : null

    return {
      ...omit(response, ['release_dates']),
      credits: { crew: formattedCrew, cast: formattedCast },
      certification,
      backdrop_path: backdropFullPath,
      poster_path: posterFullPath,
    }
  }

  async getRecommendedMovies(movieId: number) {
    const response = await http.get<TMDBMovieRecommendationsResponseType>(`/movie/${movieId}/recommendations`)

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
