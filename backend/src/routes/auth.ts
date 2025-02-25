import { Router } from "express";
import type { Request, Response } from "express";

import { verifySession } from "../middleware/sessionCookie";
import { sync } from "../utils";
import { customers, db, merchants, users } from "../drizzle";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

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

    if (
      match &&
      (match.password === inp.password ||
        (await bcrypt.compare(inp.password, match.password)))
    ) {
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

    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const record = await db
      .insert(users)
      .values({ userName, password: hashedPassword, role })
      .returning();

    //create empty profiles so the user can add favorites
    if (role === "customer") {
      await db.insert(customers).values({ id: record[0].id });
    } else if (role === "merchant") {
      await db.insert(merchants).values({ id: record[0].id });
    }

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
    const { id, usr, role, exp } = req.session || {};
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
