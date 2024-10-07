import { Request, Response } from 'express'

import tmdbService from '@/services/tmdb.services'
import { TrendingParamsType, TrendingQueryType, TrendingResponseType } from '@/schemas/tmdb.schema'

export const trendingController = async (
  req: Request<TrendingParamsType, any, any, TrendingQueryType>,
  res: Response<TrendingResponseType>
) => {
  const { trendingType, timeWindow } = req.params
  const { page } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await tmdbService.trending({
    trendingType,
    timeWindow,
    page,
    userId: tokenPayload?.userId,
  })

  return res.json({ message: 'Get trending list successful', data, pagination })
}
