import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import tmdbMoviesService from '@/services/tmdb-movies.services'
import { DiscoverQueryType, TopRatedQueryType } from '@/schemas/tmdb.schema'
import {
  DiscoverMoviesResponseType,
  MovieDetailResponseType,
  GetMovieDetailParamsType,
  TopRatedMoviesResponseType,
  RecommendedMoviesResponseType,
} from '@/schemas/tmdb-movies.schema'

export const discoverMoviesController = async (
  req: Request<ParamsDictionary, any, any, DiscoverQueryType>,
  res: Response<DiscoverMoviesResponseType>
) => {
  const { page, includeAdult, includeVideo, sortBy, voteAverageGte, voteAverageLte, withGenres } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await tmdbMoviesService.discoverMovies({
    page,
    includeAdult,
    includeVideo,
    sortBy,
    withGenres,
    voteAverageGte,
    voteAverageLte,
    userId: tokenPayload?.userId,
  })

  return res.json({ message: 'Get discover movies list successful', data, pagination })
}

export const topRatedMoviesController = async (
  req: Request<ParamsDictionary, any, any, TopRatedQueryType>,
  res: Response<TopRatedMoviesResponseType>
) => {
  const { page } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await tmdbMoviesService.topRatedMovies({ page, userId: tokenPayload?.userId })

  return res.json({ message: 'Get top rated movies list successful', data, pagination })
}

export const getMovieDetailController = async (
  req: Request<GetMovieDetailParamsType>,
  res: Response<MovieDetailResponseType>
) => {
  const { movieId } = req.params

  const tokenPayload = req.decodedAuthorization

  const data = await tmdbMoviesService.getMovieDetail({ movieId, userId: tokenPayload?.userId })

  return res.json({ message: 'Get movie detail successful', data })
}

export const getRecommendedMoviesController = async (
  req: Request<GetMovieDetailParamsType>,
  res: Response<RecommendedMoviesResponseType>
) => {
  const { movieId } = req.params

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await tmdbMoviesService.getRecommendedMovies({ movieId, userId: tokenPayload?.userId })

  return res.json({ message: 'Get recommended movies successful', data, pagination })
}