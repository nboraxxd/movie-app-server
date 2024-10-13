import z from 'zod'
import multer from 'multer'
import omit from 'lodash/omit'
import { JsonWebTokenError } from 'jsonwebtoken'
import { NextFunction, Request, RequestHandler, Response } from 'express'

import { decodeAuthorizationToken } from '@/utils/jwt'
import { capitalizeFirstLetter, escapeHtml } from '@/utils/common'
import { authorizationSchema } from '@/schemas/auth.schema'
import { HttpStatusCode } from '@/constants/http-status-code'
import { EntityError, ErrorWithStatusAndLocation } from '@/models/errors'

export type ValidationLocation = 'body' | 'params' | 'query' | 'headers' | 'file'

export const zodValidator = ({
  schema,
  location,
  customPath,
  customHandler,
}: {
  schema: z.Schema
  location: ValidationLocation
  customPath?: string
  customHandler?: (req: Request) => Promise<void>
}) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync(req[location])

      for (const key in parsedData) {
        if (typeof parsedData[key] === 'string') {
          parsedData[key] = escapeHtml(parsedData[key])
        }
      }

      req[location] = {
        ...req[location],
        ...parsedData,
      }

      if (customHandler) {
        await customHandler(req)
      }

      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (location === 'body' || location === 'file') {
          next(
            new EntityError({
              message: `Validation error occurred in ${location}`,
              errors: error.errors.map((error) => ({
                code: error.code,
                message: error.message,
                path: customPath ?? error.path.join('.'),
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

export const authorizationValidator = ({
  isLoginRequired,
  customHandler,
}: {
  isLoginRequired: boolean
  customHandler?: (req: Request) => Promise<void>
}) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization?.split('Bearer ')[1]

      if (isLoginRequired) {
        const { authorization: parsedAccessToken } = await authorizationSchema.parseAsync({
          authorization: accessToken,
        })
        await decodeAuthorizationToken(parsedAccessToken, req)
      } else if (!isLoginRequired && accessToken) {
        await decodeAuthorizationToken(accessToken, req)
      }

      if (customHandler) {
        await customHandler(req)
      }

      next()
    } catch (error) {
      if (!isLoginRequired) {
        next()
        return
      }

      if (error instanceof z.ZodError) {
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

export const tokenValidator = (
  schema: z.Schema,
  tokenHandler?: (req: Request) => Promise<void>,
  customHandler?: (req: Request) => Promise<void>
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body)

      if (tokenHandler) {
        await tokenHandler(req)
      }

      if (customHandler) {
        await customHandler(req)
      }

      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
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

export const fileValidator = (uploadFile: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadFile(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        next(
          new EntityError({
            message: 'File validation error occurred',
            errors: [{ code: error.code, message: error.message, location: 'file', path: error.field || '' }],
          })
        )
      } else {
        next()
      }
    })
  }
}
