import { workspaceMemberRepository } from "./workspaceMemberRepository";
import { workspaceRepository } from "../workspace/workspaceRepository";
import { AppDataSource } from "@/configs/typeorm.config";
import { User } from "@/common/entities/user.entity";
import { WorkspaceMemberRole } from "@/common/entities/enums";
import { ResponseStatus, ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/server";
import { AddMemberInput, ChangeRoleInput, RemoveMemberInput, WorkspaceMember } from "./workspaceMemberModel";

export class WorkspaceMemberService {
async addMember(
    currentUserId: string,
    workspaceId: string,
    payload: AddMemberInput
  ): Promise<ServiceResponse<any[] | null>> {
    try {
      const workspace = await workspaceRepository.findByIdAsync(workspaceId);
      if (!workspace) {
        return new ServiceResponse(ResponseStatus.Failed, "Workspace not found", null, StatusCodes.NOT_FOUND);
      }

      const allMembers = await workspaceMemberRepository.findAllMembersByWorkspaceId(workspaceId);

      const currentMember = allMembers.find(m => m.userId === currentUserId);
      if (!currentMember || (currentMember.role !== WorkspaceMemberRole.OWNER && currentMember.role !== WorkspaceMemberRole.ADMIN)) {
        return new ServiceResponse(ResponseStatus.Failed, "You are not authorized to add members", null, StatusCodes.FORBIDDEN);
      }

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: payload.userId });
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, "User not found", null, StatusCodes.NOT_FOUND);
      }

      const existing = allMembers.find(m => m.userId === payload.userId);
      if (existing) {
        return new ServiceResponse(ResponseStatus.Failed, "User already a member", null, StatusCodes.BAD_REQUEST);
      }

      await workspaceMemberRepository.addMember(workspace, user, payload, currentUserId);

      const members = await workspaceMemberRepository.findAllMembersByWorkspaceId(workspaceId);

      const formattedMembers = members.map((m) => ({
        userId: m.user.id,
        fullName: m.user.fullName,
        email: m.user.email,
        avatarUrl: m.user.avatarUrl,
        role: m.role,
      }));

      return new ServiceResponse(
        ResponseStatus.Success,
        "Member added successfully",
        formattedMembers,
        StatusCodes.CREATED
      );
    } catch (error) {
      const msg = `Error adding member: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }


  async removeMember(currentUserId: string, params: RemoveMemberInput): Promise<ServiceResponse<null>> {
    try {
      const { id: workspaceId, userId } = params;
      const workspace = await workspaceRepository.findByIdAsync(workspaceId);
      if (!workspace) {
        return new ServiceResponse(ResponseStatus.Failed, "Workspace not found", null, StatusCodes.NOT_FOUND);
      }

      const allMembers = await workspaceMemberRepository.findAllMembersByWorkspaceId(workspaceId);
      const currentMember = allMembers.find(m => m.userId === currentUserId);
      if (!currentMember || (currentMember.role !== WorkspaceMemberRole.OWNER && currentMember.role !== WorkspaceMemberRole.ADMIN)) {
        return new ServiceResponse(ResponseStatus.Failed, "You are not authorized to remove members", null, StatusCodes.FORBIDDEN);
      }

      if (userId === currentUserId) {
        return new ServiceResponse(ResponseStatus.Failed, "You cannot remove yourself", null, StatusCodes.BAD_REQUEST);
      }

      const removed = await workspaceMemberRepository.removeMember(workspaceId, userId);
      if (!removed) {
        return new ServiceResponse(ResponseStatus.Failed, "Member not found", null, StatusCodes.NOT_FOUND);
      }

      return new ServiceResponse(ResponseStatus.Success, "Member removed successfully", null, StatusCodes.OK);
    } catch (error) {
      const msg = `Error removing member: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async changeRole(currentUserId: string, workspaceId: string, userId: string, payload: ChangeRoleInput): Promise<ServiceResponse<WorkspaceMember | null>> {
    try {
      const workspace = await workspaceRepository.findByIdAsync(workspaceId);
      if (!workspace) {
        return new ServiceResponse(ResponseStatus.Failed, "Workspace not found", null, StatusCodes.NOT_FOUND);
      }
      
      const allMembers = await workspaceMemberRepository.findAllMembersByWorkspaceId(workspaceId);
      const currentMember = allMembers.find(m => m.userId === currentUserId);
      if (!currentMember || currentMember.role !== WorkspaceMemberRole.OWNER) {
        return new ServiceResponse(ResponseStatus.Failed, "Only owner can change roles", null, StatusCodes.FORBIDDEN);
      }

      const updated = await workspaceMemberRepository.changeRole(workspaceId, userId, payload);
      if (!updated) {
        return new ServiceResponse(ResponseStatus.Failed, "Member not found", null, StatusCodes.NOT_FOUND);
      }

      const formattedInfo = {
        workspaceId: updated.workspaceId,
        userId: updated.userId,
        role: updated.role,
        invitedBy: updated.invitedBy,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      }

      return new ServiceResponse(ResponseStatus.Success, "Role updated successfully", formattedInfo, StatusCodes.OK);
    } catch (error) {
      const msg = `Error changing role: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const workspaceMemberService = new WorkspaceMemberService();
