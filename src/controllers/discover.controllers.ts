import { Request, Response } from 'express'

import { DiscoverQueryType, MediaType } from '@/schemas/discover.schema'
import discoverService from '@/services/discover.services'
import { MoviesResponseType } from '@/schemas/movies.schema'

export const discoverController = async (
  req: Request<MediaType, any, any, DiscoverQueryType>,
  res: Response<MoviesResponseType>
) => {
  const { mediaType } = req.params
  const { page, includeAdult, includeVideo, sortBy, voteAverageGte, voteAverageLte, withGenres } = req.query

  const { data, pagination } = await discoverService.getList({
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
