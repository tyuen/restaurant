import { Router } from "express";
import type { Request, Response } from "express";

import { verifySession } from "../middleware/sessionCookie";
import { sync } from "../utils";
import { db, users } from "../drizzle";
import { eq } from "drizzle-orm";

const router = Router();
export default router;

router.post(
  "/login",
  sync(async (req: Request, res: Response) => {
    const inp = req.body;

    if (!/^[a-z][a-z0-9]{3,20}$/.test(inp.userName) || !inp.password) {
      return res.status(400).send({ error: "invalid pattern" });
    }

    const match = await db.query.users.findFirst({
      where: eq(users.userName, inp.userName),
    });

    //use simple comparison for demo
    if (match && match.password === inp.password) {
      const exp = Math.ceil(Date.now() / 1000) + 4 * 24 * 60 * 60;
      const { id, userName, role } = match;
      req.session = {
        id,
        usr: userName,
        role,
        exp,
      };
      res.send({
        status: "ok",
        id,
        userName,
        role,
        exp,
      });
    } else {
      res.status(400).send({ error: "mismatch" });
    }
  }),
);

router.post(
  "/register",
  sync(async (req: Request, res: Response) => {
    const { userName, password, role } = req.body;

    if (!userName || !password || !role) {
      return res
        .status(400)
        .send({ error: "Missing userName, password, role" });
    }

    if (!["customer", "merchant"].includes(role))
      return res.status(400).send({ error: "role" });

    if (!/^[a-z][a-z0-9]{3,20}$/.test(userName) || password.length < 8) {
      return res.send(400).send({ error: "invalid pattern" });
    }

    const match = await db.query.users.findFirst({
      where: eq(users.userName, userName),
    });

    if (match) return res.status(400).send({ error: "taken" });

    //simply assign password for demo purposes
    const record = await db
      .insert(users)
      .values({ userName, password, role })
      .returning();

    const id = record[0].id;
    const exp = Math.ceil(Date.now() / 1000) + 4 * 24 * 60 * 60;

    //set session cookie
    req.session = {
      id,
      usr: userName,
      role,
      exp,
    };

    res.send({
      status: "ok",
      id,
      userName,
      role,
      exp,
    });
  }),
);

router.post("/me", verifySession, async (req: Request, res: Response) => {
  if (req.session) {
    const { id, usr, role, exp } = req.session;
    res.send({ status: "ok", id, userName: usr, role, exp });
  } else {
    res.send({ status: "anon" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  const { userName } = req.body;
  if (!userName) return res.status(400).send({ error: "Missing userName" });

  //clear the session cookie
  if (userName === req.session?.usr) req.session = null;
  res.send({ status: "ok" });
});
