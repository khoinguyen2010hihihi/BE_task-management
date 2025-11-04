import userRouter from "./user.route";
import authRouter from "./auth.route";
import { Router } from "express";
import workspace from "./workspace.route";

const router = Router();
router.use("/", userRouter);
router.use("/auth", authRouter);
router.use("workspace", workspace);

export default router;
