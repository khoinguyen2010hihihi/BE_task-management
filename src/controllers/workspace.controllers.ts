import { Request, Response } from "express";
import workspaceService from "../services/workspace.service";

class workspaceController {
  async getAllWorkspace(req: Request, res: Response) {
    try {
      const data = await workspaceService.getAll();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getWorkspaceById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = await workspaceService.getById(id);
      res.json(data);
    } catch (err: any) {
      res.status(404).json({ err: err.message });
    }
  }

  async createWorkspace(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const data = await workspaceService.createWorkspace(name, description);
      res.status(201).json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  updateWorkspace = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { name, description, is_active } = req.body;
      const data = await workspaceService.updateWorkspace(
        id,
        name,
        description,
        is_active
      );
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  deleteWorkspace = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const data = await workspaceService.deleteWorkspace(id);
      res.json({ message: "Workspace deleted successfully", data });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}

export default new workspaceController();
