import { Schema, ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import { HttpStatusCode } from '@/constants/http-status-code'

export function zodValidator(schema: Schema, location: 'body' | 'params' | 'query' | 'headers') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req[location] = await schema.parseAsync(req[location])
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(HttpStatusCode.UnprocessableEntity).json({
          message: 'Validation error occurred when validating the request body',
          error: error.errors.map((error) => {
            return {
              message: error.message,
              field: error.path.join('.'),
            }
          }),
        })
      } else {
        return res.status(HttpStatusCode.InternalServerError).json({ message: 'Internal Server Error' })
      }
    }
  }
}
