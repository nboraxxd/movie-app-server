import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import moviesService from '@/services/movies.services'
import { DiscoverQueryType, TopRatedQueryType } from '@/schemas/common-media.schema'
import {
  DiscoverMoviesResponseType,
  MovieDetailResponseType,
  GetMovieDetailParamsType,
  TopRatedMoviesResponseType,
  RecommendedMoviesResponseType,
} from '@/schemas/movies.schema'

export const discoverMoviesController = async (
  req: Request<ParamsDictionary, any, any, DiscoverQueryType>,
  res: Response<DiscoverMoviesResponseType>
) => {
  const { page, includeAdult, includeVideo, sortBy, voteAverageGte, voteAverageLte, withGenres } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await moviesService.discoverMovies({
    page,
    includeAdult,
    includeVideo,
    sortBy,
    withGenres,
    voteAverageGte,
    voteAverageLte,
    userId: tokenPayload?.userId,
  })

  return res.json({ message: 'Get discover movie list successful', data, pagination })
}

export const topRatedMoviesController = async (
  req: Request<ParamsDictionary, any, any, TopRatedQueryType>,
  res: Response<TopRatedMoviesResponseType>
) => {
  const { page } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await moviesService.topRatedMovies({ page, userId: tokenPayload?.userId })

  return res.json({ message: 'Get top rated movie list successful', data, pagination })
}

export const getMovieDetailController = async (
  req: Request<GetMovieDetailParamsType>,
  res: Response<MovieDetailResponseType>
) => {
  const { movieId } = req.params

  const tokenPayload = req.decodedAuthorization

  const data = await moviesService.getMovieDetail({ movieId, userId: tokenPayload?.userId })

  return res.json({ message: 'Get movie detail successful', data })
}

export const getRecommendedMoviesController = async (
  req: Request<GetMovieDetailParamsType>,
  res: Response<RecommendedMoviesResponseType>
) => {
  const { movieId } = req.params

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await moviesService.getRecommendedMovies({ movieId, userId: tokenPayload?.userId })

  return res.json({ message: 'Get recommended movies successful', data, pagination })
}
