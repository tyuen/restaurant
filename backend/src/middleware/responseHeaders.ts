import type { Request, Response, NextFunction } from "express";

export default function (_req: Request, res: Response, next: NextFunction) {
  res.set({
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "Cache-Control": "private, max-age=30000",
  });
  next();
}
