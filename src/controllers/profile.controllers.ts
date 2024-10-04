import { Request, Response } from 'express'

import { TokenPayload } from '@/types/token.type'
import profileService from '@/services/profile.services'
import { GetProfileResponseType } from '@/schemas/profile.schema'

export const getProfileController = async (req: Request, res: Response<GetProfileResponseType>) => {
  const { userId } = req.decodedAuthorization as TokenPayload

  const result = await profileService.getProfile(userId)

  return res.json({ message: 'Get profile successful', data: result })
}
