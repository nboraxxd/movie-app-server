import omit from 'lodash/omit'
import { Schema, ZodError } from 'zod'
import { JsonWebTokenError } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

import { verifyToken } from '@/utils/jwt'
import { capitalizeFirstLetter } from '@/utils/common'
import { EntityError } from '@/models/errors'
import { ErrorWithLocation } from '@/models/errors'
import { AuthorizationSchema } from '@/schemas/user.schema'
import envVariables from '@/schemas/env-variables.schema'
import { HttpStatusCode } from '@/constants/http-status-code'

export type ValidationLocation = 'body' | 'params' | 'query' | 'headers'

export const formValidator = (schema: Schema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new EntityError({
            message: `Validation error occurred in ${location}`,
            errors: error.errors.map((error) => ({
              code: error.code,
              message: error.message,
              path: error.path.join('.'),
              location: 'body',
            })),
          })
        )
      } else {
        next(error)
      }
    }
  }
}

export const requireLoginValidator = () => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization?.split('Bearer ')[1]

      const { authorization: parsedAccessToken } = await AuthorizationSchema.parseAsync({ authorization: accessToken })

      const decodedAuthorization = await verifyToken({
        token: parsedAccessToken,
        secretOrPublicKey: envVariables.JWT_SECRET_ACCESS_TOKEN,
      })

      req.decodedAuthorization = decodedAuthorization

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ErrorWithLocation({
            message: error.errors.map((error) => error.message).join(', '),
            statusCode: HttpStatusCode.Unauthorized,
            location: 'headers',
          })
        )
      } else if (error instanceof JsonWebTokenError) {
        next(
          new ErrorWithLocation({
            message: capitalizeFirstLetter(error.message),
            statusCode: HttpStatusCode.Unauthorized,
            location: 'headers',
            errorInfo: omit(error, ['message']),
          })
        )
      } else {
        next(error)
      }
    }
  }
}

export const tokenValidator = (schema: Schema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ErrorWithLocation({
            message: error.errors.map((error) => error.message).join(', '),
            statusCode: HttpStatusCode.Unauthorized,
            location: 'body',
            errorInfo: error.errors.map((error) => ({
              code: error.code,
              message: error.message,
              path: error.path.join('.'),
              location: 'body',
            })),
          })
        )
      } else {
        next(error)
      }
    }
  }
}
