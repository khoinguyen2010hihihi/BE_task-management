import userRouter from "./user.route";
import authRouter from "./auth.route";
import { Router } from "express";

const router = Router();
router.use("/", userRouter);
router.use("/", authRouter);

export default router;
