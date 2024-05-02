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
          limit: 1,
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

type OrderParams = {
  merchantId: number;
  list: { id: number; qty: number | string }[];
};

router.post(
  "/add",
  verifySession,
  sync(async (req: Request, res: Response) => {
    const { list, merchantId }: OrderParams = req.body;
    const { id } = req.session || {};

    if (
      !(merchantId >= 0) ||
      !list?.find ||
      list.find(n => !(n.id >= 0) || !n.qty)
    ) {
      res.status(400).send({ error: "Invalid format" });
      return;
    }

    if (list.length <= 0) {
      res.status(400).send({ error: "Input is empty" });
      return;
    }

    //get the prices of all products
    const priceMap = new Map<number, string>();
    const catalog = await db.query.merchantProducts.findMany({
      where: eq(merchantProducts.merchantId, merchantId),
      columns: { id: true, price: true },
    });
    catalog.forEach(n => priceMap.set(n.id, n.price!));

    //attach the prices to the order list
    const listCleaned = list.map(n => ({
      orderId: -1,
      productId: n.id,
      quantity: Number(n.qty),
      price: priceMap.get(n.id)!,
    }));

    await db.transaction(async tx => {
      const insertOrder = await tx
        .insert(orders)
        .values({ customerId: id, merchantId })
        .returning({ orderId: orders.id });

      const { orderId } = insertOrder[0];

      //add the [orderId] to the list
      listCleaned.forEach(n => (n.orderId = orderId));

      return await tx.insert(orderedItems).values(listCleaned);
    });

    res.send({ status: "ok" });
  }),
);
