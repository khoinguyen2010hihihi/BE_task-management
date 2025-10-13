import { AppDataSource } from "@/configs/typeorm.config";
import { CreateWorkspaceInput, UpdateWorkspaceInput } from "./workspaceModel";
import { Repository } from "typeorm";
import { Workspace } from "@/common/entities/workspace.entity";
import { User } from "@/common/entities/user.entity";

export class WorkspaceRepository {
  private repo: Repository<Workspace>;

  constructor() {
    this.repo = AppDataSource.getRepository(Workspace)
  }

  async findAllByUserAsync(userId: string): Promise<Workspace[]> {
    return this.repo.find({
      where: [{ owner: { id: userId } }],
      relations: ['owner', 'members']
    })
  }

  async findByIdAsync(id: string): Promise<Workspace | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['owner', 'members', 'boards']
    })
  }

  async createAsync(payload: CreateWorkspaceInput, owner: User): Promise<Workspace> {
    const workspace = this.repo.create({
      ...payload,
      owner
    })
    return this.repo.save(workspace)
  }

  async updateAsync(id: string, payload: Partial<UpdateWorkspaceInput>): Promise<Workspace | null> {
    const workspace = await this.repo.findOneBy({ id });
    if (!workspace) return null;

    if (payload.name) workspace.name = payload.name;
    if (payload.description !== undefined) workspace.description = payload.description ?? null;
    if (payload.visibility) workspace.visibility = payload.visibility;
    if (payload.slug) workspace.slug = payload.slug;

    return this.repo.save(workspace);
  }

  async deleteAsync(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}

export const workspaceRepository = new WorkspaceRepository()