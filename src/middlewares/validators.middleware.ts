import omit from 'lodash/omit'
import { Schema, ZodError } from 'zod'
import { JsonWebTokenError } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

import { verifyToken } from '@/utils/jwt'
import { capitalizeFirstLetter } from '@/utils/common'
import { HttpStatusCode } from '@/constants/http-status-code'
import { EntityError, ErrorWithStatusAndLocation } from '@/models/errors'
import { authorizationSchema } from '@/schemas/auth.schema'
import envVariables from '@/schemas/env-variables.schema'

export type ValidationLocation = 'body' | 'params' | 'query' | 'headers'

export const zodValidator = (
  schema: Schema,
  location: ValidationLocation,
  customHandler?: (arg: Request) => Promise<void>
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req[location] = await schema.parseAsync(req[location])

      if (customHandler) {
        await customHandler(req)
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        if (location === 'body') {
          next(
            new EntityError({
              message: `Validation error occurred in ${location}`,
              errors: error.errors.map((error) => ({
                code: error.code,
                message: error.message,
                path: error.path.join('.'),
                location,
              })),
            })
          )
        } else {
          next(
            new ErrorWithStatusAndLocation({
              message: `Error occurred in ${location}`,
              statusCode: HttpStatusCode.BadRequest,
              location,
              errorInfo: error.errors.map((error) => ({
                message: error.message,
                path: error.path.join('.'),
              })),
            })
          )
        }
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

      const { authorization: parsedAccessToken } = await authorizationSchema.parseAsync({ authorization: accessToken })

      const decodedAuthorization = await verifyToken({
        token: parsedAccessToken,
        jwtKey: envVariables.JWT_SECRET_ACCESS_TOKEN,
      })

      req.decodedAuthorization = decodedAuthorization

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ErrorWithStatusAndLocation({
            message: error.errors.map((error) => error.message).join(', '),
            statusCode: HttpStatusCode.Unauthorized,
            location: 'headers',
          })
        )
      } else if (error instanceof JsonWebTokenError) {
        next(
          new ErrorWithStatusAndLocation({
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

export const tokenValidator = (schema: Schema, tokenHandler?: (req: Request) => Promise<void>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)

      if (tokenHandler) {
        await tokenHandler(req)
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ErrorWithStatusAndLocation({
            message: error.errors.map((error) => error.message).join(', '),
            statusCode: HttpStatusCode.Unauthorized,
            location: 'body',
            errorInfo: error.errors.map((error) => ({
              code: error.code,
              message: error.message,
              path: error.path.join('.'),
            })),
          })
        )
      } else if (error instanceof JsonWebTokenError) {
        next(
          new ErrorWithStatusAndLocation({
            message: capitalizeFirstLetter(error.message),
            statusCode: HttpStatusCode.Unauthorized,
            location: 'body',
            errorInfo: omit(error, ['message']),
          })
        )
      } else {
        next(error)
      }
    }
  }
}
