import { workspaceRepository } from './workspaceRepository';
import { StatusCodes } from "http-status-codes";
import { CreateWorkspaceInput, UpdateWorkspaceInput } from "./workspaceModel";
import { Workspace } from '@/common/entities/workspace.entity';
import { logger } from '@/server';
import { AppDataSource } from '@/configs/typeorm.config';
import { User } from '@/common/entities/user.entity';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { instanceToInstance } from 'class-transformer';
import { WorkspaceMember } from '@/common/entities/workspace-member.entity';
import { WorkspaceMemberRole } from '@/common/entities/enums';

export class WorkspaceService {
  async findAll(userId: string): Promise<ServiceResponse<Workspace[] | null>> {
    try {
      const workspaces = await workspaceRepository.findAllByUserAsync(userId)
      if (!workspaces.length) {
        return new ServiceResponse(ResponseStatus.Failed, 'No workspaces found', null, StatusCodes.NOT_FOUND)
      }
      return new ServiceResponse(ResponseStatus.Success, 'Workspaces retrieved successfully', workspaces, StatusCodes.OK)
    } catch (error) {
      const msg = `Error retrieving workspaces: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: string): Promise<ServiceResponse<Workspace | null>> {
    try {
      const workspace = await workspaceRepository.findByIdAsync(id);
      if (!workspace) {
        return new ServiceResponse(ResponseStatus.Failed, 'Workspace not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(ResponseStatus.Success, 'Workspace found', workspace, StatusCodes.OK);
    } catch (err) {
      const msg = `Error retrieving workspace ${id}: ${(err as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(userId: string, payload: CreateWorkspaceInput): Promise<ServiceResponse<Workspace | null>> {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const memberRepo = AppDataSource.getRepository(WorkspaceMember);
      const owner = await userRepo.findOneBy({ id: userId });
      if (!owner) {
        return new ServiceResponse(ResponseStatus.Failed, 'Owner not found', null, StatusCodes.BAD_REQUEST);
      }

      const workspace = await workspaceRepository.createAsync(payload, owner);
      const ownerMember = memberRepo.create({
        workspaceId: workspace.id,
        userId: owner.id,
        workspace,
        user: owner,
        role: WorkspaceMemberRole.OWNER,
        invitedBy: null
      })
      await memberRepo.save(ownerMember);
      const fullWorkspace = await workspaceRepository.findByIdAsync(workspace.id);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Workspace created successfully',
        instanceToInstance(fullWorkspace),
        StatusCodes.CREATED
      );
    } catch (err) {
      const msg = `Error creating workspace: ${(err as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, payload: Partial<UpdateWorkspaceInput>): Promise<ServiceResponse<Workspace | null>> {
    try {
      const updated = await workspaceRepository.updateAsync(id, payload);
      if (!updated) {
        return new ServiceResponse(ResponseStatus.Failed, 'Workspace not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(
        ResponseStatus.Success,
        'Workspace updated successfully',
        instanceToInstance(updated),
        StatusCodes.OK
      );
    } catch (err) {
      const msg = `Error updating workspace: ${(err as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string): Promise<ServiceResponse<null>> {
    try {
      const deleted = await workspaceRepository.deleteAsync(id);
      if (!deleted) {
        return new ServiceResponse(ResponseStatus.Failed, 'Workspace not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(ResponseStatus.Success, 'Workspace deleted successfully', null, StatusCodes.OK);
    } catch (err) {
      const msg = `Error deleting workspace: ${(err as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const workspaceService = new WorkspaceService()