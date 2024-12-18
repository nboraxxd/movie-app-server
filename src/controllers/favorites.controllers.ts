import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types/token.type'
import { capitalizeFirstLetter } from '@/utils/common'
import { MessageResponseType } from '@/schemas/common.schema'
import { CursorPageQueryType } from '@/schemas/common-media.schema'
import {
  AddFavoriteBodyType,
  AddFavoriteResponseType,
  CheckFavoriteByMediaResponseType,
  DeleteFavoriteByIdParamsType,
  FavoriteByMediaParamsType,
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
  req: Request<ParamsDictionary, any, any, CursorPageQueryType>,
  res: Response<GetMyFavoritesResponseType>
) => {
  const { cursor } = req.query
  const { userId } = req.decodedAuthorization as TokenPayload

  const { data, hasNextPage } = await favoritesService.getMyFavorites({ userId, cursor })

  return res.json({
    message: 'Get favorites successful',
    data: data.map((favorite) => ({
      ...favorite,
      _id: favorite._id.toHexString(),
    })),
    hasNextPage,
  })
}

export const deleteFavoriteByIdController = async (
  req: Request<DeleteFavoriteByIdParamsType>,
  res: Response<MessageResponseType>
) => {
  const { favoriteId } = req.params
  const { userId } = req.decodedAuthorization as TokenPayload

  await favoritesService.deleteFavoriteById({ favoriteId, userId })

  return res.json({ message: 'Delete favorite by id successful' })
}

export const checkIsFavoriteByMediaController = async (
  req: Request<FavoriteByMediaParamsType>,
  res: Response<CheckFavoriteByMediaResponseType>
) => {
  const { mediaId, mediaType } = req.params
  const { userId } = req.decodedAuthorization as TokenPayload

  const isFavorite = await favoritesService.checkIsFavoriteByMedia({ mediaId, mediaType, userId })

  return res.json({ message: 'Check favorite by media successful', data: isFavorite })
}

export const deleteFavoriteByMediaController = async (
  req: Request<FavoriteByMediaParamsType>,
  res: Response<MessageResponseType>
) => {
  const { mediaId, mediaType } = req.params
  const { userId } = req.decodedAuthorization as TokenPayload

  await favoritesService.deleteFavoriteByMedia({ mediaId, mediaType, userId })

  return res.json({ message: 'Delete favorite by media successful' })
}
