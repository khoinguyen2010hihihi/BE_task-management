import { Request, Response } from 'express';
import { workspaceService } from './workspaceService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

export class WorkspaceController {
  async getAllWorkspaces(req: Request, res: Response): Promise<void> {
      const userId = (req as any).user?.id || '';
      const serviceResponse = await workspaceService.findAll(userId);
      handleServiceResponse(serviceResponse, res);
  }

  async getWorkspaceById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const serviceResponse = await workspaceService.findById(id);
    handleServiceResponse(serviceResponse, res);
  }

  async createWorkspace(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || '';
    const workspaceData = req.body;
    const serviceResponse = await workspaceService.create(userId, workspaceData);
    handleServiceResponse(serviceResponse, res);
  }

  async updateWorkspace(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const workspaceData = req.body;
    const serviceResponse = await workspaceService.update(id, workspaceData);
    handleServiceResponse(serviceResponse, res);
  }

  async deleteWorkspace(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const serviceResponse = await workspaceService.delete(id);
    handleServiceResponse(serviceResponse, res);
  }
}

export const workspaceController = new WorkspaceController();
