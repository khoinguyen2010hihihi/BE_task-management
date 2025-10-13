import { webcrypto } from "crypto";
import { AppDataSource } from "../data-source";
import { workspace } from "../entities/workspace.entity";

class WorkspaceModel {
  private workspaceRepository = AppDataSource.getRepository(workspace);

  async getAll() {
    return await this.workspaceRepository.find({
      where: { is_delete: false },
      order: { id: "ASC" },
    });
  }

  async getById(id: number) {
    return await this.workspaceRepository.findOne({ where: { id } });
  }

  async createWorkspace(name: string, description: string) {
    const workspace = this.workspaceRepository.create({ name, description });
    return await this.workspaceRepository.save(workspace);
  }

  async updateWorkspace(
    id: number,
    name: string,
    description: string,
    is_active: boolean
  ) {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });
    if (!workspace) throw new Error("Workspace not found");

    workspace.name = name;
    workspace.description = description;
    workspace.is_active = is_active;

    return await this.workspaceRepository.save(workspace);
  }

  async softDelete(id: number) {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });
    if (!workspace) throw new Error("workspace not found");

    workspace.is_delete = true;
    return await this.workspaceRepository.save(workspace);
  }
}

export default new WorkspaceModel();
