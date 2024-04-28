import { Router } from "express";
import type { Request, Response } from "express";

import authRouter from "./auth";

export const router = Router();

router.get("/", (req: Request, res: Response) => res.send({ status: "OK" }));

router.get("/auth", authRouter);
