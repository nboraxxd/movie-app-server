import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import moviesService from '@/services/movies.services'
import { MoviesQueryType, MoviesResponseType } from '@/schemas/movies.schema'

export const popularMoviesController = async (
  req: Request<ParamsDictionary, any, any, MoviesQueryType>,
  res: Response<MoviesResponseType>
) => {
  const { page } = req.query

  const { data, pagination } = await moviesService.getPopularMovies({ page })

  return res.json({ message: 'Get popular movies successfully', data, pagination })
}
