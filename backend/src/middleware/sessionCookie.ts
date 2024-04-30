import type { Request, Response, NextFunction } from "express";

export function extendCookieExpires(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const expires = req.session?.exp ?? 0;
  const remaining = expires - Math.ceil(Date.now() / 1000);
  if (expires) {
    if (remaining < 10 * 60 * 60) {
      if (!req.session) req.session = {};
      //extend the session expiry
      req.session.rand = Math.ceil(Date.now() / 60e3);
    } else if (remaining < 0) {
      //clear the session cookie
      req.session = null;
      res.status(401).send({ error: "Session expired" });
      return;
    }
  }
  next();
}

export function verifySession(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.usr) {
    res.status(401).send({ error: "Not logged in" });
  } else {
    next();
  }
}
