import { Router } from "express";
import boardController from "../controllers/board.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../utils/http-handler";
import { BoardSchema } from "../schemas/board.schema";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, asyncHandler(boardController.getAll));

router.get(
  "/:id",
  authMiddleware,
  validateRequest(BoardSchema.GetById),
  asyncHandler(boardController.getById)
);

router.post(
  "/",
  authMiddleware,
  validateRequest(BoardSchema.Create),
  asyncHandler(boardController.create)
);

router.put(
  "/:id",
  authMiddleware,
  validateRequest(BoardSchema.Update),
  asyncHandler(boardController.update)
);

router.delete(
  "/:id",
  authMiddleware,
  validateRequest(BoardSchema.Delete),
  asyncHandler(boardController.delete)
);

router.get(
  "/workspace/:workspace_id",
  authMiddleware,
  validateRequest(BoardSchema.GetByWorkspace),
  asyncHandler(boardController.getByWorkspaceId)
);

export default router;
