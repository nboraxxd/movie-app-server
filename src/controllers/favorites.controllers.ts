import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types/token.type'
import { capitalizeFirstLetter } from '@/utils/common'
import {
  AddFavoriteBodyType,
  AddFavoriteResponseType,
  GetFavoritesQueryType,
  GetMyFavoritesResponseType,
} from '@/schemas/favorite.schema'
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
    return res.json({ message: `${capitalizeFirstLetter(mediaType)} already added to favorites`, data: null })
  }

  return res.json({
    message: 'Favorite added successful',
    data: { ...data, _id: data._id.toHexString(), userId: data.userId.toHexString() },
  })
}

export const getMyFavoritesController = async (
  req: Request<ParamsDictionary, any, any, GetFavoritesQueryType>,
  res: Response<GetMyFavoritesResponseType>
) => {
  const { page } = req.query
  const { userId } = req.decodedAuthorization as TokenPayload

  const { data, pagination } = await favoritesService.getMyFavorites({ userId, page })

  return res.json({
    message: 'Get favorites successful',
    data: data.map((favorite) => ({
      ...favorite,
      _id: favorite._id.toHexString(),
    })),
    pagination,
  })
}
