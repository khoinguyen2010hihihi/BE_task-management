import boardModel from "../model/board.model";
import { Board } from "../entities/board.entity";

class BoardService {
  async getAll(): Promise<Board[]> {
    return await boardModel.getAll();
  }

  async getById(id: number): Promise<Board> {
    const board = await boardModel.getById(id);
    if (!board) throw new Error("Board not found");
    return board;
  }

  async getBoardsByWorkspaceId(workspace_id: number): Promise<Board[]> {
    const boards = await boardModel.getBoardsByWorkspaceId(workspace_id);
    if (!boards || boards.length === 0)
      throw new Error("No boards found for this workspace");
    return boards;
  }

  async createBoard(
    name: string,
    workspace_id: number,
    cover_url?: string
  ): Promise<Board> {
    return await boardModel.createBoard(name, workspace_id, cover_url);
  }

  async updateBoard(
    id: number,
    name: string,
    cover_url?: string
  ): Promise<Board> {
    return await boardModel.updateBoard(id, name, cover_url);
  }

  async deleteBoard(id: number): Promise<void> {
    await boardModel.deleteBoard(id);
  }
}

export default new BoardService();
