import { Request, Response } from 'express'

import {
  PersonDetailParamsType,
  GetPersonDetailResponseType,
  GetPersonCombinedCreditsResponseType,
} from '@/schemas/people.schema'
import peopleService from '@/services/people.services'

export const getPersonDetailController = async (
  req: Request<PersonDetailParamsType>,
  res: Response<GetPersonDetailResponseType>
) => {
  const { personId } = req.params

  const data = await peopleService.getPersonDetail(personId)

  return res.json({ message: 'Get movie detail successful', data })
}

export const getPersonCombinedCreditsController = async (
  req: Request<PersonDetailParamsType>,
  res: Response<GetPersonCombinedCreditsResponseType>
) => {
  const { personId } = req.params

  const data = await peopleService.getPersonCombinedCredits(personId)

  return res.json({ message: 'Get person combined credits successful', data })
}
