import type { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  const exp = req.session?.exp ?? 0;
  const remaining = exp - Math.ceil(Date.now() / 1000);
  if (exp) {
    if (remaining < 10 * 60 * 60) {
      if (!req.session) req.session = {};
      //extend the session expiry
      req.session.rand = Math.ceil(Date.now() / 60e3) % 10000;
    } else if (remaining < 0) {
      //clear the session cookie
      req.session = null;
      res.status(500).send({ error: "Session expired" });
    }
  }
  next();
}
