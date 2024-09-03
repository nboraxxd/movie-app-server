import { ZodIssueCode } from 'zod'
import { HttpStatusCode } from '@/constants/http-status-code'
import { ValidationLocation } from '@/middlewares/validators.middleware'

type ErrorsType = { code: ZodIssueCode; message: string; path: string; location: ValidationLocation }[]

type TStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode]

export class ErrorWithStatus extends Error {
  statusCode: TStatusCode

  constructor({ message, statusCode }: { message: string; statusCode: TStatusCode }) {
    super(message)
    this.statusCode = statusCode
  }
}

export class ErrorWithLocation extends ErrorWithStatus {
  location: ValidationLocation
  errorInfo?: Record<string, any>

  constructor({
    message,
    statusCode,
    location,
    errorInfo,
  }: {
    message: string
    statusCode: TStatusCode
    location: ValidationLocation
    errorInfo?: Record<string, any>
  }) {
    super({ message, statusCode })
    this.location = location
    this.errorInfo = errorInfo
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType

  constructor({ message = 'Validation error', errors }: { message?: string; errors: ErrorsType }) {
    super({ message, statusCode: HttpStatusCode.UnprocessableEntity })
    this.errors = errors
  }
}
