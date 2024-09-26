import { Request, Response } from 'express'
import { TrendingParamsType, TrendingQueryType, TrendingResponseType } from '@/schemas/trending.schema'
import trendingService from '@/services/trending.services'

export const trendingController = async (
  req: Request<TrendingParamsType, any, any, TrendingQueryType>,
  res: Response<TrendingResponseType>
) => {
  const { trendingType, timeWindow } = req.params
  const { page } = req.query

  const { data, pagination } = await trendingService.getList({
    trendingType,
    timeWindow,
    page,
  })

  return res.json({ message: 'Get trending list successfully', data, pagination })
}
