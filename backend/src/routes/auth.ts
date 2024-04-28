import { Router } from "express";
import type { NextFunction, Request, Response } from "express";

import { sync } from "../utils";
import { db, users } from "../drizzle";
import { eq } from "drizzle-orm";

const router = Router();

router.post(
  "/login",
  sync(async (req: Request, res: Response, next: NextFunction) => {
    const inp = req.body;

    if (!inp.userName || !inp.password) {
      return res.send({ error: "Missing userName or password" });
    }

    const match = await db.query.users.findFirst({
      where: eq(users.userName, inp.userName),
    });

    //use simple comparison for demo
    if (match && match.password === inp.password) {
      const exp = Math.ceil(Date.now() / 1000) + 4 * 24 * 60 * 60;
      const { userName, role } = match;
      req.session = {
        usr: userName,
        role,
        exp,
      };
      res.send({
        status: "ok",
        userName,
        role,
        exp,
      });
    } else {
      res.send({ error: "Incorrect userName or password" });
    }
  }),
);

router.post(
  "/register",
  sync(async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password, role } = req.body;

    if (!userName || !password || !role) {
      return res.send({ error: "Missing userName, password, role" });
    }

    if (!["customer", "merchant"].includes(role))
      return res.send({ error: "role" });

    if (userName.length <= 4 || password.length < 8) {
      return res.send({ error: "too short" });
    }

    const match = await db.query.users.findFirst({
      where: eq(users.userName, userName),
    });

    if (match) return res.send({ error: "taken" });

    //simply assign password for demo purposes
    const record = await db
      .insert(users)
      .values({ userName, password, role })
      .returning();

    const exp = Math.ceil(Date.now() / 1000) + 4 * 24 * 60 * 60;

    //set session cookie
    req.session = {
      usr: userName,
      role,
      exp,
    };

    res.send({
      status: "ok",
      userName,
      role,
      exp,
    });
  }),
);

router.post("/me", async (req: Request, res: Response, next: NextFunction) => {
  if (req.session) {
    const { usr, role, exp } = req.session;
    res.send({ status: "ok", userName: usr, role, exp });
  } else {
    res.send({ status: "anonymous" });
  }
});

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  const { userName } = req.body;
  if (!userName) return res.send({ error: "Missing userName" });

  //clear the session cookie
  if (userName === req.session?.usr) req.session = null;
  res.send({ status: "ok" });
});

export default router;
