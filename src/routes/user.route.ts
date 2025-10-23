import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";

const router = Router();

router.get(
  "/api/users",
  authMiddleware,
  authorize("view_all"),
  UserController.getUsers
);
router.get(
  "/api/user/:id",
  authMiddleware,
  authorize("view_self"),
  UserController.getUser
);
router.post(
  "/api/user",
  authMiddleware,
  authorize("create_user"),
  UserController.createUser
);
router.put(
  "/api/user/:id",
  authMiddleware,
  authorize("update_user"),
  UserController.updateUser
);
router.delete(
  "/api/user/:id",
  authMiddleware,
  authorize("delete_user"),
  UserController.deleteUser
);

export default router;
