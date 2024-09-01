import { NextFunction, Request, Response } from 'express'

type Func<T> = (
  req: Request<T, any, any, qs.ParsedQs, Record<string, any>>,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>>>

export function wrapRequestHandler<T>(func: Func<T>) {
  return async (req: Request<T, any, any, qs.ParsedQs, Record<string, any>>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
