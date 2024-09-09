import z from 'zod'
import { movieSchema } from '@/schemas/movies.schema'

export const queryPageSchema = z.coerce
  .number({ message: 'Page must be a number' })
  .int({ message: 'Page must be an integer' })
  .positive({ message: 'Page must be a positive number' })
  .default(1)
  .optional()

// total_pages và total_results dùng snake_case vì dữ liệu trả về từ API có dạng snake_case
export const tmdbListResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

export type TMDBListResponseType = z.TypeOf<typeof tmdbListResponseSchema>
