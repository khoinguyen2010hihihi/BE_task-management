import express from "express";
import workspaceController from "../controllers/workspace.controllers";

const router = express.Router();

router.get("/", workspaceController.getAllWorkspace);
router.get("/:id", workspaceController.getWorkspaceById);
router.post("/", workspaceController.createWorkspace);
router.put("/:id", workspaceController.updateWorkspace);
router.delete("/:id", workspaceController.deleteWorkspace);

export default router;
