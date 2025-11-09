import workspaceModel from "../model/workspace.model";
import { ErrorResponse, ForbiddenError, InternalServerError, NotFoundError } from "../handler/error.response";
class WorkspaceService {
  async getAll() {
    try {
      return await workspaceModel.getAll();
    } catch (error) {
      throw new InternalServerError("Error fetching workspaces");
    }
  }

  async getAllByUser(userId: number) {
    try {
      return await workspaceModel.getAllByUser(userId);
    } catch (error) {
      throw new InternalServerError("Error fetching workspaces for user");
    }
  }

  async getById(id: number) {
    try {
      const workspace = await workspaceModel.getById(id);
      if (!workspace) throw new ErrorResponse("Workspace not found", 404);
      return workspace;
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new InternalServerError("Error fetching workspace");
    }
  }

  async createWorkspace(name: string, description: string, ownerId: number) {
    try {
      return await workspaceModel.createWorkspace(name, description, ownerId);
    } catch (error) {
      throw new InternalServerError("Error creating workspace");
    }
  }

  async updateWorkspace(
    id: number,
    name: string,
    description: string,
    is_active: boolean,
    userId: number
  ) {
    try {
      return await workspaceModel.updateWorkspace(
        id,
        name,
        description,
        is_active,
        userId
      );
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      if (error instanceof Error && error.message === "Workspace not found") {
        throw new NotFoundError(error.message);
      }
      if (error instanceof Error && error.message === "Permission denied") {
        throw new ForbiddenError(error.message);
      }
      throw new InternalServerError("Error updating workspace");
    }
  }

  async deleteWorkspace(id: number, userId: number) {
    try {
      return await workspaceModel.softDelete(id, userId);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      if (error instanceof Error && error.message === "Workspace not found") {
        throw new NotFoundError(error.message);
      }
      if (error instanceof Error && error.message === "Permission denied") {
        throw new ForbiddenError(error.message);
      }
      throw new InternalServerError("Error deleting workspace");
    }
  }
}

export default new WorkspaceService();
