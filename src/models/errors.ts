import { ZodIssueCode } from 'zod'
import { HttpStatusCode } from '@/constants/http-status-code'

type ErrorsType = { code: ZodIssueCode; message: string; path: string }[]

type TStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode]

export class ErrorWithStatus extends Error {
  statusCode: TStatusCode

  constructor({ message, statusCode }: { message: string; statusCode: TStatusCode }) {
    super(message)
    this.statusCode = statusCode
  }
}

export class ErrorWithLocation extends ErrorWithStatus {
  location: string

  constructor({ message, statusCode, location }: { message: string; statusCode: TStatusCode; location: string }) {
    super({ message, statusCode })
    this.location = location
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType

  constructor({ message = 'Validation error', errors }: { message?: string; errors: ErrorsType }) {
    super({ message, statusCode: HttpStatusCode.UnprocessableEntity })
    this.errors = errors
  }
}
