import type { NextFunction, Request, Response } from "express";

//wraps an async router handler to work with express's sync
export function sync<T = void>(handler: (..._: any[]) => Promise<T>) {
  const len = handler.length;
  if (len === 4) {
    return (err: Error, req: Request, res: Response, next: NextFunction) =>
      handler(err, req, res, next).catch((e: unknown) => next(e));
  } else if (len < 5) {
    return (req: Request, res: Response, next: NextFunction) =>
      handler(req, res, next).catch((e: unknown) => next(e));
  } else {
    return handler;
  }
}
