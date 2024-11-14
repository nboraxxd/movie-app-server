import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import moviesService from '@/services/movies.services'
import { PageQueryType, SearchQueryType } from '@/schemas/common-media.schema'
import {
  DiscoverMoviesResponseType,
  MovieDetailResponseType,
  MovieIdParamsType,
  TopRatedMoviesResponseType,
  RecommendedMoviesResponseType,
  DiscoverMoviesQueryType,
  SearchMoviesResponseType,
  MovieCreditsResponseType,
  GenresMovieResponseType,
} from '@/schemas/movies.schema'

export const discoverMoviesController = async (
  req: Request<ParamsDictionary, any, any, DiscoverMoviesQueryType>,
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
  req: Request<ParamsDictionary, any, any, PageQueryType>,
  res: Response<TopRatedMoviesResponseType>
) => {
  const { page } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await moviesService.topRatedMovies({ page, userId: tokenPayload?.userId })

  return res.json({ message: 'Get top rated movie list successful', data, pagination })
}

export const searchMoviesController = async (
  req: Request<ParamsDictionary, any, any, SearchQueryType>,
  res: Response<SearchMoviesResponseType>
) => {
  const { page, query } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await moviesService.searchMovies({ page, query, userId: tokenPayload?.userId })

  return res.json({ message: 'Get search movie list successful', data, pagination })
}

export const getMovieDetailController = async (
  req: Request<MovieIdParamsType>,
  res: Response<MovieDetailResponseType>
) => {
  const { movieId } = req.params

  const data = await moviesService.getMovieDetail(movieId)

  return res.json({ message: 'Get movie detail successful', data })
}

export const getMovieCreditsController = async (
  req: Request<MovieIdParamsType>,
  res: Response<MovieCreditsResponseType>
) => {
  const { movieId } = req.params

  const data = await moviesService.getMovieCredits(movieId)

  return res.json({ message: 'Get movie credits successful', data })
}

export const getRecommendedMoviesController = async (
  req: Request<MovieIdParamsType, any, any, PageQueryType>,
  res: Response<RecommendedMoviesResponseType>
) => {
  const { movieId } = req.params
  const { page } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await moviesService.getRecommendedMovies({ movieId, page, userId: tokenPayload?.userId })

  return res.json({ message: 'Get recommended successful', data, pagination })
}

export const getMovieGenresController = async (_req: Request, res: Response<GenresMovieResponseType>) => {
  const data = await moviesService.getMovieGenres()

  return res.json({ message: 'Get genres successful', data })
}
