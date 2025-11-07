import userRouter from "./user.route";
import { Router } from "express";
import authControllers from "../controllers/auth.controllers";
import validateMiddleware from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.use("/", userRouter);

router.post(
  "/login",
  validateMiddleware.validateLogin,
  authControllers.loginUser
);

router.post("/register", authControllers.registerUser);
router.get("/verify-email", authControllers.verifyEmail);
router.post("/refresh", authControllers.refreshToken);
router.get("/information", authMiddleware, authControllers.getInformation);
//CRUD workspace, board, database theo rbac.
//register,

export default router;
