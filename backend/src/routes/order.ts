import { Router } from "express";
import type { Request, Response } from "express";

import { sync } from "../utils";
import {
  db,
  merchants,
  merchantTypes,
  merchantProducts,
  orders,
  orderedItems,
} from "../drizzle";
import { eq, and, asc, desc } from "drizzle-orm";
import { verifySession } from "../middleware/sessionCookie";

const router = Router();
export default router;

router.post("/list", verifySession, (req: Request, res: Response) => {
  const { offset, limit } = req.body;

  const { id } = req.session || {};

  db.query.orders
    .findMany({
      where: eq(orders.customerId, id),
      orderBy: [desc(orders.createdAt)],
      with: {
        merchant: { with: { type: true } },
        items: {
          with: { product: true },
          limit: 3,
          orderBy: desc(merchantProducts.price),
        },
      },
      columns: {
        customerId: false,
      },
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

router.post("/latest", verifySession, (req: Request, res: Response) => {
  const { id } = req.session || {};

  db.query.orders
    .findFirst({
      where: eq(orders.customerId, id),
      orderBy: [desc(orders.createdAt)],
      with: {
        merchant: { with: { type: true } },
        items: {
          with: { product: true },
          orderBy: asc(orderedItems.productId),
        },
      },
      columns: {
        customerId: false,
      },
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
