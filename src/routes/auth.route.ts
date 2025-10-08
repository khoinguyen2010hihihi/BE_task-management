import userRouter from "./user.route";
import { Router } from "express";
import authControllers from "../controllers/auth.controllers";
import validateMiddleware from "../middleware/validate.middleware";

const router = Router();
router.use("/", userRouter);

router.post(
  "/login",
  validateMiddleware.validateLogin,
  authControllers.loginUser
);

export default router;
