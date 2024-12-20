import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import {
  PersonDetailParamsType,
  GetPersonDetailResponseType,
  GetPersonCombinedCreditsResponseType,
  SearchPeopleResponseType,
} from '@/schemas/people.schema'
import peopleService from '@/services/people.services'
import { SearchQueryType } from '@/schemas/common-media.schema'

export const searchPeopleController = async (
  req: Request<ParamsDictionary, any, any, SearchQueryType>,
  res: Response<SearchPeopleResponseType>
) => {
  const { page, query } = req.query

  const { data, pagination } = await peopleService.searchPeople({ page, query })

  return res.json({ message: 'Get search people list successful', data, pagination })
}

export const getPersonDetailController = async (
  req: Request<PersonDetailParamsType>,
  res: Response<GetPersonDetailResponseType>
) => {
  const { personId } = req.params

  const data = await peopleService.getPersonDetail(personId)

  return res.json({ message: 'Get person detail successful', data })
}

export const getPersonCombinedCreditsController = async (
  req: Request<PersonDetailParamsType>,
  res: Response<GetPersonCombinedCreditsResponseType>
) => {
  const { personId } = req.params

  const data = await peopleService.getPersonCombinedCredits(personId)

  return res.json({ message: 'Get person combined credits successful', data })
}
