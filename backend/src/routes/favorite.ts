import { Router } from "express";
import type { Request, Response } from "express";

import { sync } from "../utils";
import { db, merchants, customerFavorites } from "../drizzle";
import { eq, and, asc, desc } from "drizzle-orm";
import { verifySession } from "../middleware/sessionCookie";

const router = Router();
export default router;

router.post("/list", verifySession, (req: Request, res: Response) => {
  const { id } = req.session || {};

  db.query.customerFavorites
    .findMany({
      with: { merchant: { with: { type: true } } },
    })
    .then(
      list => {
        //reshape result: {merchantId, customerId, merchant}[n] => merchant[n]
        res.send({ list: list.map(i => i.merchant) });
      },
      err => {
        res.status(400).send({ error: err?.message || err.toString() });
      },
    );
});

router.post("/check-merchant", verifySession, (req: Request, res: Response) => {
  const { merchantId } = req.body;
  if (!merchantId) {
    res.status(400).send({ error: "Missing merchantId" });
    return;
  }

  const { id } = req.session || {};

  db.query.customerFavorites
    .findFirst({
      where: and(
        eq(customerFavorites.customerId, id),
        eq(customerFavorites.merchantId, merchantId),
      ),
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

router.post(
  "/set-merchant",
  verifySession,
  sync(async (req: Request, res: Response) => {
    const { merchantId, state } = req.body;
    if (!merchantId) {
      res.status(400).send({ error: "Missing merchantId" });
      return;
    }

    const record = await db.query.merchants.findFirst({
      where: eq(merchants.id, merchantId),
      columns: { id: true },
    });

    if (!record) {
      res.status(400).send({ error: "Invalid merchant" });
      return;
    }

    const { id } = req.session || {};

    if (state) {
      await db
        .insert(customerFavorites)
        .values({ customerId: id, merchantId })
        .onConflictDoNothing();
    } else {
      await db
        .delete(customerFavorites)
        .where(
          and(
            eq(customerFavorites.customerId, id),
            eq(customerFavorites.merchantId, merchantId),
          ),
        );
    }
    res.send({ status: "ok" });
  }),
);
