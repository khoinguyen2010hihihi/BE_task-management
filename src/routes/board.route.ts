import { Router } from "express";
import boardController from "../controllers/board.controller";

const router = Router();

router.get("/", boardController.getAll);
router.get("/:id", boardController.getById);
router.post("/", boardController.create);
router.put("/:id", boardController.update);
router.delete("/:id", boardController.delete);
router.get("/workspace/:workspace_id", boardController.getByWorkspaceId);

export default router;
