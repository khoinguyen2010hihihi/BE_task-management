import { Request, Response } from "express";
import { workspaceMemberService } from "./workspaceMemberService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

export class WorkspaceMemberController {
  async addMember(req: Request, res: Response): Promise<void> {
    const currentUserId = (req as any).user?.id;
    const workspaceId = req.params.id;
    const payload = req.body;
    const serviceResponse = await workspaceMemberService.addMember(currentUserId, workspaceId, payload);
    handleServiceResponse(serviceResponse, res);
  }

  async removeMember(req: Request, res: Response): Promise<void> {
    const currentUserId = (req as any).user?.id;
    const params = { id: req.params.id as string, userId: req.params.userId as string };
    const serviceResponse = await workspaceMemberService.removeMember(currentUserId, params);
    handleServiceResponse(serviceResponse, res);
  }

  async changeRole(req: Request, res: Response): Promise<void> {
    const currentUserId = (req as any).user?.id as string;
    const workspaceId = req.params.id as string;
    const userId = req.params.userId as string;
    const payload = req.body;
    const serviceResponse = await workspaceMemberService.changeRole(currentUserId, workspaceId, userId, payload);
    handleServiceResponse(serviceResponse, res);
  }

  // added: get all members
  async getAllMembers(req: Request, res: Response): Promise<void> {
    const currentUserId = (req as any).user?.id;
    const workspaceId = req.params.id as string;
    const serviceResponse = await workspaceMemberService.getAllMembers(currentUserId, workspaceId);
    handleServiceResponse(serviceResponse, res);
  }
}

export const workspaceMemberController = new WorkspaceMemberController();
