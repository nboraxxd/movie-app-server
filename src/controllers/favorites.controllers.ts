import { FavoriteBodyType } from '@/schemas/favorite.schema'
import favoritesService from '@/services/favorites.services'
import { TokenPayload } from '@/types/token.type'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const favoriteController = async (req: Request<ParamsDictionary, any, FavoriteBodyType>, res: Response<any>) => {
  const { backdropPath, mediaId, posterPath, releaseDate, title, type, voteAverage } = req.body

  const { userId } = req.decodedAuthorization as TokenPayload

  const result = await favoritesService.addFavorite({
    backdropPath,
    mediaId,
    posterPath,
    releaseDate,
    title,
    type,
    userId,
    voteAverage,
  })

  return res.json({ message: 'Favorite added successfully', data: result })
}
