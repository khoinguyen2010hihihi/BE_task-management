import { Router } from "express";
import userController from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../utils/http-handler";
import { UserSchema } from "../schemas/user.schema";

const router = Router();

router.get(
  "/api/users",
  authMiddleware,
  authorize("view_all"),
  asyncHandler(userController.getUsers)
);

router.get(
  "/api/user/:id",
  authMiddleware,
  authorize("view_self"),
  validateRequest(UserSchema.GetById),
  asyncHandler(userController.getUser)
);

router.post(
  "/api/user",
  authMiddleware,
  authorize("create_user"),
  validateRequest(UserSchema.Create),
  asyncHandler(userController.createUser)
);

router.put(
  "/api/user/:id",
  authMiddleware,
  authorize("update_user"),
  validateRequest(UserSchema.Update),
  asyncHandler(userController.updateUser)
);

router.delete(
  "/api/user/:id",
  authMiddleware,
  authorize("delete_user"),
  validateRequest(UserSchema.Delete),
  asyncHandler(userController.deleteUser)
);

export default router;
