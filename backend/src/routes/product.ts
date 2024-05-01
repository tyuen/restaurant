import { Router } from "express";
import type { Request, Response } from "express";

import { sync } from "../utils";
import { db, merchants, merchantTypes, merchantProducts } from "../drizzle";
import { eq, and, asc } from "drizzle-orm";
import { verifySession } from "../middleware/sessionCookie";

const router = Router();
export default router;

router.post("/list", (req: Request, res: Response) => {
  const { offset, limit, merchantId } = req.body;

  if (!(merchantId >= 0)) {
    res.status(400).send({ error: "Invalid merchantId" });
    return;
  }

  db.query.merchantProducts
    .findMany({
      where: eq(merchantProducts.merchantId, merchantId),
      orderBy: [asc(merchantProducts.name)],
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

router.post(
  "/save-item",
  verifySession,
  sync(async (req: Request, res: Response) => {
    const { id, merchantId, name, price } = req.body;

    if (!(merchantId >= 0) || merchantId !== req.session?.id) {
      res.status(400).send({ error: "Denied not owner" });
      return;
    }

    const values = { merchantId, name, price };

    const record = await db
      .insert(merchantProducts)
      .values(id >= 0 ? { id, ...values } : values)
      .onConflictDoUpdate({ target: merchantProducts.id, set: values });

    res.send({ status: "ok" });
  }),
);

router.post(
  "/del-item",
  verifySession,
  sync(async (req: Request, res: Response) => {
    const { id, merchantId } = req.body;

    if (!(merchantId >= 0) || merchantId !== req.session?.id) {
      res.status(400).send({ error: "Denied not owner" });
      return;
    }

    const rows = await db
      .delete(merchantProducts)
      .where(
        and(
          eq(merchantProducts.id, id),
          eq(merchantProducts.merchantId, merchantId),
        ),
      )
      .returning();

    res.send({ status: "ok", id: rows[0].id });
  }),
);
