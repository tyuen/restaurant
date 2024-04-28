import type { Request, Response, NextFunction } from "express";

export default function (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err.stack);
  res.status(500).send({ error: "Unhandled exception" });
}
