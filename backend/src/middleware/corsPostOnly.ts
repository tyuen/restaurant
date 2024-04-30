import type { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  if (req.method === "POST") {
    if (req.get("x-requested-with") !== "XMLHttpRequest") {
      res.status(403).send("X-Requested-With required");
      return;
    }
  }
  next();
}
