import { boardMemberRepository } from "./boardMemberRepository";
import { boardRepository } from "../board/boardRepository";
import { AppDataSource } from "@/configs/typeorm.config";
import { User } from "@/common/entities/user.entity";
import { WorkspaceMemberRole, BoardMemberRole } from "@/common/entities/enums";
import { ResponseStatus, ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import { AddMemberInput, ChangeRoleInput, RemoveMemberInput } from "./boardMemberModel";
import { workspaceMemberRepository } from "../workspace-member/workspaceMemberRepository";

export class BoardMemberService {
  async addMember(currentUserId: string, boardId: string, payload: AddMemberInput): Promise<ServiceResponse<any[] | null>> {
    try {
      const board = await boardRepository.findByIdAsync(boardId);
      if (!board)
        return new ServiceResponse(ResponseStatus.Failed, "Board not found", null, StatusCodes.NOT_FOUND);

      // Check quyền của currentUser trong workspace chứa board
      const workspaceId = board.workspace.id;
      const workspaceMembers = await workspaceMemberRepository.findAllMembersByWorkspaceId(workspaceId);
      const currentMember = workspaceMembers.find(m => m.userId === currentUserId);

      if (!currentMember || (currentMember.role !== WorkspaceMemberRole.OWNER && currentMember.role !== WorkspaceMemberRole.ADMIN))
        return new ServiceResponse(ResponseStatus.Failed, "You are not authorized to add members to this board", null, StatusCodes.FORBIDDEN);

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: payload.userId });
      if (!user)
        return new ServiceResponse(ResponseStatus.Failed, "User not found", null, StatusCodes.NOT_FOUND);

      const existingMembers = await boardMemberRepository.findAllByBoardId(boardId);
      const existing = existingMembers.find(m => m.userId === payload.userId);
      if (existing)
        return new ServiceResponse(ResponseStatus.Failed, "User already a member", null, StatusCodes.BAD_REQUEST);

      await boardMemberRepository.addMember(board, user, payload);
      const updatedMembers = await boardMemberRepository.findAllByBoardId(boardId);

      const formatted = updatedMembers.map(m => ({
        userId: m.user.id,
        fullName: m.user.fullName,
        email: m.user.email,
        avatarUrl: m.user.avatarUrl,
        role: m.role,
      }));

      return new ServiceResponse(ResponseStatus.Success, "Board member added successfully", formatted, StatusCodes.CREATED);
    } catch (error) {
      const msg = `Error adding board member: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async removeMember(currentUserId: string, params: RemoveMemberInput): Promise<ServiceResponse<null>> {
    try {
      const { id: boardId, userId } = params;
      const board = await boardRepository.findByIdAsync(boardId);
      if (!board)
        return new ServiceResponse(ResponseStatus.Failed, "Board not found", null, StatusCodes.NOT_FOUND);

      const workspaceId = board.workspace.id;
      const workspaceMembers = await workspaceMemberRepository.findAllMembersByWorkspaceId(workspaceId);
      const currentMember = workspaceMembers.find(m => m.userId === currentUserId);

      if (!currentMember || (currentMember.role !== WorkspaceMemberRole.OWNER && currentMember.role !== WorkspaceMemberRole.ADMIN))
        return new ServiceResponse(ResponseStatus.Failed, "You are not authorized to remove board members", null, StatusCodes.FORBIDDEN);

      const removed = await boardMemberRepository.removeMember(boardId, userId);
      if (!removed)
        return new ServiceResponse(ResponseStatus.Failed, "Board member not found", null, StatusCodes.NOT_FOUND);

      return new ServiceResponse(ResponseStatus.Success, "Board member removed successfully", null, StatusCodes.OK);
    } catch (error) {
      const msg = `Error removing board member: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async changeRole(currentUserId: string, boardId: string, userId: string, payload: ChangeRoleInput): Promise<ServiceResponse<any | null>> {
    try {
      const board = await boardRepository.findByIdAsync(boardId);
      if (!board)
        return new ServiceResponse(ResponseStatus.Failed, "Board not found", null, StatusCodes.NOT_FOUND);

      const workspaceId = board.workspace.id;
      const workspaceMembers = await workspaceMemberRepository.findAllMembersByWorkspaceId(workspaceId);
      const currentMember = workspaceMembers.find(m => m.userId === currentUserId);

      if (!currentMember || currentMember.role !== WorkspaceMemberRole.OWNER)
        return new ServiceResponse(ResponseStatus.Failed, "Only workspace owner can change board roles", null, StatusCodes.FORBIDDEN);

      const updated = await boardMemberRepository.changeRole(boardId, userId, payload);
      if (!updated)
        return new ServiceResponse(ResponseStatus.Failed, "Board member not found", null, StatusCodes.NOT_FOUND);

      const formatted = {
        boardId: updated.boardId,
        userId: updated.userId,
        role: updated.role,
        updatedAt: updated.updatedAt,
      };

      return new ServiceResponse(ResponseStatus.Success, "Board member role updated successfully", formatted, StatusCodes.OK);
    } catch (error) {
      const msg = `Error changing board member role: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllMembers(boardId: string): Promise<ServiceResponse<any[] | null>> {
    try {
      const board = await boardRepository.findByIdAsync(boardId);
      if (!board)
        return new ServiceResponse(ResponseStatus.Failed, "Board not found", null, StatusCodes.NOT_FOUND);
      const members = await boardMemberRepository.findAllByBoardId(boardId);

      const formatted = members.map(m => ({
        userId: m.user.id,
        fullName: m.user.fullName,
        email: m.user.email,
        avatarUrl: m.user.avatarUrl,
        role: m.role,
      }));
      return new ServiceResponse(ResponseStatus.Success, "Board members retrieved successfully", formatted, StatusCodes.OK);
    } catch (error) {
      const msg = `Error retrieving board members: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const boardMemberService = new BoardMemberService();
