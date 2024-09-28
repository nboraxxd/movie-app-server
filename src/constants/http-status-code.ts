export const HttpStatusCode = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  UnprocessableEntity: 422,
  TooManyRequests: 429,
  InternalServerError: 500,
} as const

export type TStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode]
