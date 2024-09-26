import z from 'zod'

export const queryPageSchema = z.coerce
  .number({ message: 'Page must be a number' })
  .int({ message: 'Page must be an integer' })
  .positive({ message: 'Page must be a positive number' })
  .default(1)
  .optional()

export const commonResultTMDB = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
})

export type CommonResultTMDBType = z.TypeOf<typeof commonResultTMDB>
