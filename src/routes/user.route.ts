import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.get("api/users", UserController.getUsers);
router.get("/api/user/:id", UserController.getUser);
router.post("/api/user", UserController.createUser);
router.put("/api/user/:id", UserController.updateUser);
router.delete("/api/user/:id", UserController.deleteUser);

export default router;
