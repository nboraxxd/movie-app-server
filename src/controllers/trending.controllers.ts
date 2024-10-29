import { Request, Response } from 'express'

import trendingService from '@/services/trending.services'
import { PageQueryType } from '@/schemas/common-media.schema'
import { TrendingParamsType, TrendingResponseType } from '@/schemas/trending.shema'

export const trendingController = async (
  req: Request<TrendingParamsType, any, any, PageQueryType>,
  res: Response<TrendingResponseType>
) => {
  const { trendingType, timeWindow } = req.params
  const { page } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await trendingService.trending({
    trendingType,
    timeWindow,
    page,
    userId: tokenPayload?.userId,
  })

  return res.json({ message: 'Get trending list successful', data, pagination })
}
