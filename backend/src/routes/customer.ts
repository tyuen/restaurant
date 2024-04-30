import { Router } from "express";
import type { Request, Response } from "express";

import { sync } from "../utils";
import { db, customers, users, merchantTypes } from "../drizzle";
import { eq } from "drizzle-orm";
import { verifySession } from "../middleware/sessionCookie";

const router = Router();
export default router;

router.post(
  "/profile",
  verifySession,
  sync(async (req: Request, res: Response) => {
    const { usr: userName, role } = req.session || {};

    if (role !== "customer") {
      res.status(400).send({ error: "Invalid role" });
      return;
    }
    const match = await db.query.users.findFirst({
      where: eq(users.userName, userName),
      with: { customer: true },
      columns: {
        password: false,
      },
    });
    res.send(match);
  }),
);

router.post(
  "/set-profile",
  verifySession,
  sync(async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const { id, role } = req.session || {};

    if (role !== "customer") {
      res.status(400).send({ error: "wrong role" });
      return;
    }

    const record = await db
      .insert(customers)
      .values({ id, name, email })
      .onConflictDoUpdate({
        target: users.id,
        set: { name, email },
      })
      .returning();
    res.send({ status: "ok", ...record[0] });
  }),
);
