import { Request, Response } from "express";
import { boardService } from "./boardService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

export class BoardController {
  async getAll(req: Request, res: Response): Promise<void> {
    const { workspaceId } = req.params;
    const response = await boardService.getAll(workspaceId);
    handleServiceResponse(response, res);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { boardId } = req.params;
    const response = await boardService.getById(boardId);
    handleServiceResponse(response, res);
  }

  async create(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id;
    const { workspaceId } = req.params;
    const payload = req.body;
    const response = await boardService.create(userId, workspaceId, payload);
    handleServiceResponse(response, res);
  }

  async update(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id;
    const { workspaceId, boardId } = req.params;
    const payload = req.body;
    const response = await boardService.update(userId, workspaceId, boardId, payload);
    handleServiceResponse(response, res);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id;
    const { workspaceId, boardId } = req.params;
    const response = await boardService.delete(userId, workspaceId, boardId);
    handleServiceResponse(response, res);
  }
}

export const boardController = new BoardController();
