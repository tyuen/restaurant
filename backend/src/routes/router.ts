import { Router } from "express";
import type { Request, Response } from "express";

import authRouter from "./auth";
import merchantRouter from "./merchant";
import customerRouter from "./customer";
import productRouter from "./product";

export const router = Router();

router.get("/", (req: Request, res: Response) => res.send({ status: "OK" }));

router.use("/auth", authRouter);
router.use("/merchant", merchantRouter);
router.use("/customer", customerRouter);
router.use("/product", productRouter);
