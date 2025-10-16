import { AppDataSource } from "@/configs/typeorm.config";
import { Repository } from "typeorm";
import { WorkspaceMember } from "@/common/entities/workspace-member.entity";
import { User } from "@/common/entities/user.entity";
import { Workspace } from "@/common/entities/workspace.entity";
import { WorkspaceMemberRole } from "@/common/entities/enums";
import { AddMemberInput, ChangeRoleInput } from "./workspaceMemberModel";

export class WorkspaceMemberRepository {
  private repo: Repository<WorkspaceMember>;

  constructor() {
    this.repo = AppDataSource.getRepository(WorkspaceMember);
  }

  // Lấy tất cả member của workspace
  async findAllMembersByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]> {
    return this.repo.find({
      where: { workspaceId },
      relations: ['user'],
      order: { createdAt: 'ASC' }
    });
  }

  async addMember(
    workspace: Workspace,
    user: User,
    payload: AddMemberInput,
    invitedBy?: string
  ): Promise<WorkspaceMember> {
    const member = this.repo.create({
      workspaceId: workspace.id,
      userId: user.id,
      workspace,
      user,
      role: payload.role as WorkspaceMemberRole,
      invitedBy: invitedBy || null,
    });
    return this.repo.save(member);
  }

  async removeMember(workspaceId: string, userId: string): Promise<boolean> {
    const result = await this.repo.delete({ workspaceId, userId });
    return result.affected !== 0;
  }
  
  async changeRole(
    workspaceId: string,
    userId: string,
    payload: ChangeRoleInput
  ): Promise<WorkspaceMember | null> {
    const members = await this.findAllMembersByWorkspaceId(workspaceId);
    const member = members.find(m => m.userId === userId);
    if (!member) return null;

    member.role = payload.role as WorkspaceMemberRole;
    return this.repo.save(member);
  }
}

export const workspaceMemberRepository = new WorkspaceMemberRepository();
