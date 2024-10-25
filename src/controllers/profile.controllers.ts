import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { TokenPayload } from '@/types/token.type'
import { uploadToCloudinary } from '@/utils/cloudinary'
import profileService from '@/services/profile.services'
import { MessageResponseType } from '@/schemas/common.schema'
import { GetProfileResponseType, UpdateProfileBodyType, UpdateProfileResponseType } from '@/schemas/profile.schema'

export const getProfileController = async (req: Request, res: Response<GetProfileResponseType>) => {
  const { userId } = req.decodedAuthorization as TokenPayload

  const result = await profileService.getProfile(userId)

  return res.json({ message: 'Get profile successful', data: result })
}

export const uploadAvatarController = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File

  const result = await uploadToCloudinary(file)

  return res.json({ message: 'Upload avatar successful', data: result.secure_url })
}

export const updateProfileController = async (
  req: Request<ParamsDictionary, any, UpdateProfileBodyType>,
  res: Response<UpdateProfileResponseType>
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const { avatar, name } = req.body

  const result = await profileService.updateProfile(userId, { avatar, name })

  return res.json({ message: 'Update profile successful', data: result })
}

export const verifyPasswordController = async (_req: Request, res: Response<MessageResponseType>) => {
  return res.json({ message: 'Verify password successful' })
}

export const deleteMyAccountController = async (req: Request, res: Response<MessageResponseType>) => {
  const { userId } = req.decodedAuthorization as TokenPayload

  await profileService.deleteMyAccount(new ObjectId(userId))

  return res.json({ message: 'Delete account successful' })
}
