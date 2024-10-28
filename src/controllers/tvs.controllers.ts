import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import tvsService from '@/services/tvs.services'
import { SearchQueryType, TopRatedQueryType } from '@/schemas/common-media.schema'
import {
  DiscoverTvsQueryType,
  DiscoverTvsResponseType,
  GetTvDetailParamsType,
  RecommendedTvsResponseType,
  SearchTvsResponseType,
  TopRatedTvsResponseType,
  TvDetailResponseType,
} from '@/schemas/tv.schema'

export const discoverTvsController = async (
  req: Request<ParamsDictionary, any, any, DiscoverTvsQueryType>,
  res: Response<DiscoverTvsResponseType>
) => {
  const { page, includeAdult, sortBy, voteAverageGte, voteAverageLte, withGenres } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await tvsService.discoverTvs({
    page,
    includeAdult,
    sortBy,
    withGenres,
    voteAverageGte,
    voteAverageLte,
    userId: tokenPayload?.userId,
  })

  return res.json({ message: 'Get discover tv list successful', data, pagination })
}

export const topRatedTvsController = async (
  req: Request<ParamsDictionary, any, any, TopRatedQueryType>,
  res: Response<TopRatedTvsResponseType>
) => {
  const { page } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await tvsService.topRatedTvs({ page, userId: tokenPayload?.userId })

  return res.json({ message: 'Get top rated tv list successful', data, pagination })
}

export const searchTvsController = async (
  req: Request<ParamsDictionary, any, any, SearchQueryType>,
  res: Response<SearchTvsResponseType>
) => {
  const { page, query } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await tvsService.searchTvs({ page, query, userId: tokenPayload?.userId })

  return res.json({ message: 'Get search tv list successful', data, pagination })
}

export const getTvDetailController = async (
  req: Request<GetTvDetailParamsType>,
  res: Response<TvDetailResponseType>
) => {
  const { tvId } = req.params

  const tokenPayload = req.decodedAuthorization

  const data = await tvsService.getTvDetail({ tvId, userId: tokenPayload?.userId })

  return res.json({ message: 'Get tv detail successful', data })
}

export const getRecommendedTvsController = async (
  req: Request<GetTvDetailParamsType>,
  res: Response<RecommendedTvsResponseType>
) => {
  const { tvId } = req.params

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await tvsService.getRecommendedTvs({ tvId, userId: tokenPayload?.userId })

  return res.json({ message: 'Get recommended successful', data, pagination })
}
