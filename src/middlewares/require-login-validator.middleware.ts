import omit from 'lodash/omit'
import { ZodError } from 'zod'
import { JsonWebTokenError } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

import { verifyToken } from '@/utils/jwt'
import { capitalizeFirstLetter } from '@/utils/common'
import { ErrorWithLocation } from '@/models/errors'
import { AuthorizationSchema } from '@/schemas/user.schema'
import envVariables from '@/schemas/env-variables.schema'

export function requireLoginValidator() {
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
            message: error.errors.map((error) => `${error.path}: ${error.message}`).join(', '),
            statusCode: 401,
            location: 'headers',
          })
        )
      } else if (error instanceof JsonWebTokenError) {
        next(
          new ErrorWithLocation({
            message: capitalizeFirstLetter(error.message),
            statusCode: 401,
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
