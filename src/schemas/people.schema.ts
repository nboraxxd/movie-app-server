import z from 'zod'

import { movieDataSchema } from '@/schemas/movies.schema'
import { tvDataSchema } from '@/schemas/tv.schema'

export const personDetailParamsSchema = z.object({
  personId: z.coerce.number({ message: 'Person ID must be a number' }).int({ message: 'Person ID must be an integer' }),
})

export type PersonDetailParamsType = z.TypeOf<typeof personDetailParamsSchema>

export const getPersonDetailResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    adult: z.boolean(),
    alsoKnownAs: z.array(z.string()),
    biography: z.string(),
    birthday: z.string().nullable(),
    deathday: z.string().nullable(),
    gender: z.number(),
    homepage: z.string().nullable(),
    id: z.number(),
    imdbId: z.string().nullable(),
    knownForDepartment: z.string(),
    name: z.string(),
    placeOfBirth: z.string().nullable(),
    popularity: z.number(),
    profilePath: z.string().nullable(),
  }),
})

export type GetPersonDetailResponseType = z.TypeOf<typeof getPersonDetailResponseSchema>

export const getPersonCombinedCreditsResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    cast: z.array(
      z.union([
        movieDataSchema
          .omit({ isFavorite: true })
          .extend({ character: z.string(), creditId: z.string(), order: z.number() }),
        tvDataSchema
          .omit({ isFavorite: true })
          .extend({ character: z.string(), creditId: z.string(), episodeCount: z.number() }),
      ])
    ),
    crew: z.array(
      z.union([
        movieDataSchema
          .omit({ isFavorite: true })
          .extend({ creditId: z.string(), department: z.string(), job: z.string() }),
        tvDataSchema
          .omit({ isFavorite: true })
          .extend({ creditId: z.string(), department: z.string(), episodeCount: z.number(), job: z.string() }),
      ])
    ),
  }),
})

export type GetPersonCombinedCreditsResponseType = z.TypeOf<typeof getPersonCombinedCreditsResponseSchema>
