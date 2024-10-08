import { Request, Response } from 'express'

import { uploadToCloudinary } from '@/utils/cloudinary'
import { TokenPayload } from '@/types/token.type'
import profileService from '@/services/profile.services'
import { GetProfileResponseType } from '@/schemas/profile.schema'

export const getProfileController = async (req: Request, res: Response<GetProfileResponseType>) => {
  const { userId } = req.decodedAuthorization as TokenPayload

  const result = await profileService.getProfile(userId)

  return res.json({ message: 'Get profile successful', data: result })
}

export const uploadAvatarController = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File
  console.log('🔥 ~ uploadAvatarController ~ file:', file)

  const result = await uploadToCloudinary(file)

  return res.json({ message: 'Upload avatar successful', data: result.secure_url })
}
