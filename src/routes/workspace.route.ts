import { WorkspaceSchema } from './../schemas/workspace.shema';
import express from "express";
import workspaceController from "../controllers/workspace.controllers";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../utils/http-handler";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, asyncHandler(workspaceController.getAllWorkspace));

router.get(
  "/:id",
  authMiddleware,
  validateRequest(WorkspaceSchema.GetById),
  asyncHandler(workspaceController.getWorkspaceById)
);

router.post(
  "/",
  authMiddleware,
  validateRequest(WorkspaceSchema.Create),
  asyncHandler(workspaceController.createWorkspace)
);

router.put(
  "/:id",
  authMiddleware,
  validateRequest(WorkspaceSchema.Update),
  asyncHandler(workspaceController.updateWorkspace)
);

router.delete(
  "/:id",
  authMiddleware,
  validateRequest(WorkspaceSchema.Delete),
  asyncHandler(workspaceController.deleteWorkspace)
);

export default router;
