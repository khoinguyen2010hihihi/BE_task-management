import workspaceModel from "../model/workspace.model";

class WorkspaceService {
  async getAll() {
    return await workspaceModel.getAll();
  }

  async getById(id: number) {
    const workspace = await workspaceModel.getById(id);
    if (!workspace) throw new Error("Workspace not found");
    return workspace;
  }

  async createWorkspace(name: string, description: string){
    return await workspaceModel.createWorkspace(name, description);
  }

  async updateWorkspace(id: number, name: string, description: string, is_active: boolean){
    return await workspaceModel.updateWorkspace(id, name, description, is_active);
  }

  async deleteWorkspace(id: number){
    return await workspaceModel.softDelete(id);
  }
}

export default new WorkspaceService();
