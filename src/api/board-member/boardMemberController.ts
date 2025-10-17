import { Request, Response } from "express";
import { boardMemberService } from "./boardMemberService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

export class BoardMemberController {
  async addMember(req: Request, res: Response): Promise<void> {
    const currentUserId = (req as any).user?.id;
    const boardId = req.params.id;
    const payload = req.body;
    const response = await boardMemberService.addMember(currentUserId, boardId, payload);
    handleServiceResponse(response, res);
  }

  async removeMember(req: Request, res: Response): Promise<void> {
    const currentUserId = (req as any).user?.id;
    const params = { id: req.params.id as string, userId: req.params.userId as string };
    const response = await boardMemberService.removeMember(currentUserId, params);
    handleServiceResponse(response, res);
  }

  async changeRole(req: Request, res: Response): Promise<void> {
    const currentUserId = (req as any).user?.id as string;
    const boardId = req.params.id as string;
    const userId = req.params.userId as string;
    const payload = req.body;
    const response = await boardMemberService.changeRole(currentUserId, boardId, userId, payload);
    handleServiceResponse(response, res);
  }

  async getAllMembers(req: Request, res: Response): Promise<void> {
    const boardId = req.params.id as string;
    const response = await boardMemberService.getAllMembers(boardId);
    handleServiceResponse(response, res);
  }
}

export const boardMemberController = new BoardMemberController();
