import { Schema, ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import { EntityError } from '@/models/errors'

export function zodValidator(schema: Schema, location: 'body' | 'params' | 'query' | 'headers') {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req[location] = await schema.parseAsync(req[location])
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('🔥 ~ return ~ error:', error)
        const entityError = new EntityError({
          message: `Validation error occurred in ${location}`,
          errors: error.errors.map((error) => ({
            code: error.code,
            message: error.message,
            path: error.path.join('.'),
          })),
        })
        next(entityError)
      } else {
        next(error)
      }
    }
  }
}
