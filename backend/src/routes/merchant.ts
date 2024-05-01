import { Router } from "express";
import type { Request, Response } from "express";

import { sync } from "../utils";
import { db, merchants, users, merchantTypes } from "../drizzle";
import { asc, eq } from "drizzle-orm";
import { verifySession } from "../middleware/sessionCookie";

const router = Router();
export default router;

router.post(
  "/profile",
  verifySession,
  sync(async (req: Request, res: Response) => {
    const { usr: userName, role } = req.session || {};

    if (role !== "merchant") {
      res.status(400).send({ error: "Invalid role" });
      return;
    }

    const match = await db.query.users.findFirst({
      where: eq(users.userName, userName),
      with: { merchant: true },
      columns: {
        password: false,
      },
    });
    res.send(match || { status: "ok", isEmpty: true });
  }),
);

router.post(
  "/set-profile",
  verifySession,
  sync(async (req: Request, res: Response) => {
    const { name, address, type, newType } = req.body;
    const { id, role } = req.session || {};

    if (role !== "merchant") {
      res.status(400).send({ error: "Invald role" });
      return;
    }

    let newTypeId;
    if (newType) {
      const match = await db.query.merchantTypes.findFirst({
        where: eq(merchantTypes.type, newType),
      });
      if (match) {
        newTypeId = match.id;
      } else {
        const record = await db
          .insert(merchantTypes)
          .values({ type: newType })
          .onConflictDoNothing()
          .returning();
        newTypeId = record[0].id;
      }
    }
    if (newTypeId) {
      const record = await db
        .insert(merchants)
        .values({ id, name, address, type: newTypeId })
        .onConflictDoUpdate({
          target: users.id,
          set: { name, address, type: newTypeId },
        })
        .returning();
      res.send({ status: "ok", ...record[0] });
    } else {
      const record = await db
        .insert(merchants)
        .values({ id, name, address, type })
        .onConflictDoUpdate({
          target: users.id,
          set: { name, address, type },
        })
        .returning();
      res.send({ status: "ok", ...record[0] });
    }
  }),
);

router.get("/all-types", (req: Request, res: Response) => {
  db.query.merchantTypes
    .findMany({
      orderBy: [asc(merchantTypes.type)],
    })
    .then(
      list => {
        res.set("cache-control", "max-age=30").send({ list });
      },
      err => {
        res.status(400).send({ error: err?.message || err.toString() });
      },
    );
});

router.post("/list", (req: Request, res: Response) => {
  const { offset, limit, type } = req.body;
  db.query.merchants
    .findMany({
      with: { type: true },
      orderBy: [asc(merchants.name)],
      offset: offset ?? 0,
      limit: limit ?? 12,
    })
    .then(
      list => {
        res.send({ list });
      },
      err => {
        res.status(400).send({ error: err?.message || err.toString() });
      },
    );
});

router.post("/get", (req: Request, res: Response) => {
  const { id } = req.body;
  db.query.merchants
    .findFirst({
      where: eq(merchants.id, id),
      with: { type: true },
    })
    .then(
      obj => {
        res.send(obj || { status: "ok", isEmpty: true });
      },
      err => {
        res.status(400).send({ error: err?.message || err.toString() });
      },
    );
});
