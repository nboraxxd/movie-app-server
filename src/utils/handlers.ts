import { NextFunction, Request, Response } from 'express'

type Func<P, Q> = (
  req: Request<P, any, any, Q, Record<string, any>>,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>>>

export function wrapRequestHandler<P, Q>(func: Func<P, Q>) {
  return async (req: Request<P, any, any, Q, Record<string, any>>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
