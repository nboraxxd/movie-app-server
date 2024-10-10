import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import tvsService from '@/services/tvs.services'
import { TopRatedTvsResponseType } from '@/schemas/tv.schema'
import { TopRatedQueryType } from '@/schemas/common-media.schema'

export const topRatedTvsController = async (
  req: Request<ParamsDictionary, any, any, TopRatedQueryType>,
  res: Response<TopRatedTvsResponseType>
) => {
  const { page } = req.query

  const tokenPayload = req.decodedAuthorization

  const { data, pagination } = await tvsService.topRatedTvs({ page, userId: tokenPayload?.userId })

  return res.json({ message: 'Get top rated tv list successful', data, pagination })
}
