import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import tmdbService from '@/services/tmdb.services'
import {
  DiscoverParamsType,
  DiscoverQueryType,
  DiscoverResponseType,
  TrendingParamsType,
  TrendingQueryType,
  TrendingResponseType,
  TvTopRatedResponseType,
} from '@/schemas/tmdb.schema'

export const discoverController = async (
  req: Request<DiscoverParamsType, any, any, DiscoverQueryType>,
  res: Response<DiscoverResponseType>
) => {
  const { mediaType } = req.params
  const { page, includeAdult, includeVideo, sortBy, voteAverageGte, voteAverageLte, withGenres } = req.query

  const { data, pagination } = await tmdbService.discover({
    page,
    mediaType,
    includeAdult,
    includeVideo,
    sortBy,
    withGenres,
    voteAverageGte,
    voteAverageLte,
  })

  return res.json({ message: 'Get discover list successfully', data, pagination })
}

export const trendingController = async (
  req: Request<TrendingParamsType, any, any, TrendingQueryType>,
  res: Response<TrendingResponseType>
) => {
  const { trendingType, timeWindow } = req.params
  const { page } = req.query

  const { data, pagination } = await tmdbService.trending({
    trendingType,
    timeWindow,
    page,
  })

  return res.json({ message: 'Get trending list successfully', data, pagination })
}

export const tvTopRatedController = async (
  req: Request<ParamsDictionary, any, any, TrendingQueryType>,
  res: Response<TvTopRatedResponseType>
) => {
  const { page } = req.query

  const { data, pagination } = await tmdbService.tvTopRated({ page })

  return res.json({ message: 'Get top rated TV shows successfully', data, pagination })
}
