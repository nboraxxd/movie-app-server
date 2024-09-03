import { HttpStatusCode } from 'axios'
import { NextFunction, Request, Response } from 'express'

import { ErrorWithStatus } from '@/models/errors'
import { omit } from 'lodash'

export function defaultErrorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.log('🍓 ERROR:', err.message)

  if (err instanceof ErrorWithStatus) {
    const { statusCode, message, ...rest } = err

    return res.status(statusCode).json({ message, ...rest })
  } else {
    Object.getOwnPropertyNames(err).forEach((key) => {
      Object.defineProperty(err, key, { enumerable: true })
    })
    return res.status(HttpStatusCode.InternalServerError).json({ message: err.message, errorInfo: omit(err, 'stack') })
  }
}
