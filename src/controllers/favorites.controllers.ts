import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types/token.type'
import { AddFavoriteBodyType, AddFavoriteResponseType } from '@/schemas/favorite.schema'
import favoritesService from '@/services/favorites.services'

export const addFavoriteController = async (
  req: Request<ParamsDictionary, any, AddFavoriteBodyType>,
  res: Response<AddFavoriteResponseType>
) => {
  const { mediaId, mediaPoster, mediaReleaseDate, mediaTitle, mediaType } = req.body

  const { userId } = req.decodedAuthorization as TokenPayload

  const { data, isNew } = await favoritesService.addFavoriteMedia({
    mediaId,
    mediaPoster,
    mediaReleaseDate,
    mediaTitle,
    mediaType,
    userId,
  })

  if (!isNew) {
    return res.json({ message: 'Media already added to favorites', data: null })
  }

  return res.json({
    message: 'Favorite added successful',
    data: { ...data, _id: data._id.toHexString(), userId: data.userId.toHexString() },
  })
}
