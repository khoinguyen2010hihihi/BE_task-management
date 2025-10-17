import { boardRepository } from "./boardRepository";
import { workspaceRepository } from "../workspace/workspaceRepository";
import { AppDataSource } from "@/configs/typeorm.config";
import { User } from "@/common/entities/user.entity";
import { ServiceResponse, ResponseStatus } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import { CreateBoardInput, UpdateBoardInput } from "./boardModel";
import { WorkspaceMemberRole } from "@/common/entities/enums";
import { workspaceMemberRepository } from "../workspace-member/workspaceMemberRepository";

export class BoardService {
  async getAll(workspaceId: string): Promise<ServiceResponse<any>> {
    try {
      const boards = await boardRepository.findAllByWorkspaceAsync(workspaceId);
      return new ServiceResponse(ResponseStatus.Success, "Boards retrieved successfully", boards, StatusCodes.OK);
    } catch (error) {
      const msg = `Error retrieving boards: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getById(boardId: string): Promise<ServiceResponse<any>> {
    try {
      const board = await boardRepository.findByIdAsync(boardId);
      if (!board)
        return new ServiceResponse(ResponseStatus.Failed, "Board not found", null, StatusCodes.NOT_FOUND);

      return new ServiceResponse(ResponseStatus.Success, "Board retrieved successfully", board, StatusCodes.OK);
    } catch (error) {
      const msg = `Error retrieving board: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(currentUserId: string, workspaceId: string, payload: CreateBoardInput): Promise<ServiceResponse<any>> {
    try {
      const workspace = await workspaceRepository.findByIdAsync(workspaceId);
      if (!workspace)
        return new ServiceResponse(ResponseStatus.Failed, "Workspace not found", null, StatusCodes.NOT_FOUND);

      const member = await workspaceMemberRepository.findAllMembersByWorkspaceId(workspaceId);
      const current = member.find((m) => m.userId === currentUserId);

      if (!current || (current.role !== WorkspaceMemberRole.OWNER && current.role !== WorkspaceMemberRole.ADMIN))
        return new ServiceResponse(ResponseStatus.Failed, "You are not authorized to create a board", null, StatusCodes.FORBIDDEN);

      const userRepo = AppDataSource.getRepository(User);
      const creator = await userRepo.findOneBy({ id: currentUserId });

      const board = await boardRepository.createAsync(payload, workspace, creator!);
      const fommatedInfo = {
        id: board.id,
        name: board.name,
        slug: board.slug,
        description: board.description,
        background: board.background,
        isClosed: board.isClosed,
        visibility: board.visibility,
        createdBy: {
          id: creator?.id,
          fullName: creator?.fullName,
          email: creator?.email
        },
        createdAt: board.createdAt,
        updatedAt: board.updatedAt
      }
      return new ServiceResponse(ResponseStatus.Success, "Board created successfully", fommatedInfo, StatusCodes.CREATED);
    } catch (error) {
      const msg = `Error creating board: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(currentUserId: string, workspaceId: string, boardId: string, payload: UpdateBoardInput): Promise<ServiceResponse<any>> {
    try {
      const member = await workspaceMemberRepository.findAllMembersByWorkspaceId(workspaceId);
      const current = member.find((m) => m.userId === currentUserId);

      if (!current || (current.role !== WorkspaceMemberRole.OWNER && current.role !== WorkspaceMemberRole.ADMIN))
        return new ServiceResponse(ResponseStatus.Failed, "You are not authorized to update boards", null, StatusCodes.FORBIDDEN);

      const updated = await boardRepository.updateAsync(boardId, payload);
      if (!updated)
        return new ServiceResponse(ResponseStatus.Failed, "Board not found", null, StatusCodes.NOT_FOUND);

      return new ServiceResponse(ResponseStatus.Success, "Board updated successfully", updated, StatusCodes.OK);
    } catch (error) {
      const msg = `Error updating board: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(currentUserId: string, workspaceId: string, boardId: string): Promise<ServiceResponse<null>> {
    try {
      const member = await workspaceMemberRepository.findAllMembersByWorkspaceId(workspaceId);
      const current = member.find((m) => m.userId === currentUserId);

      if (!current || (current.role !== WorkspaceMemberRole.OWNER && current.role !== WorkspaceMemberRole.ADMIN))
        return new ServiceResponse(ResponseStatus.Failed, "You are not authorized to delete boards", null, StatusCodes.FORBIDDEN);

      const deleted = await boardRepository.deleteAsync(boardId);
      if (!deleted)
        return new ServiceResponse(ResponseStatus.Failed, "Board not found", null, StatusCodes.NOT_FOUND);

      return new ServiceResponse(ResponseStatus.Success, "Board deleted successfully", null, StatusCodes.OK);
    } catch (error) {
      const msg = `Error deleting board: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const boardService = new BoardService();
