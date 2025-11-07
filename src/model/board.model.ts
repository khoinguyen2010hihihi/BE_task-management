import { AppDataSource } from "../data-source";
import { Board } from "../entities/board.entity";

class BoardModel {
  private boardRepository = AppDataSource.getRepository(Board);

  async getAll(): Promise<Board[]> {
    return await this.boardRepository.find({
      relations: ["workspace"],
      order: { id: "ASC" },
    });
  }

  async getById(id: number): Promise<Board | null> {
    return await this.boardRepository.findOne({
      where: { id },
      relations: ["workspace"],
    });
  }

  async getBoardsByWorkspaceId(workspace_id: number): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { workspace_id },
      order: { id: "ASC" },
    });
  }

  async createBoard(
    name: string,
    workspace_id: number,
    cover_url?: string
  ): Promise<Board> {
    const newBoard = this.boardRepository.create({
      name,
      workspace_id,
      cover_url: cover_url || null,
    });
    return await this.boardRepository.save(newBoard);
  }

  async updateBoard(
    id: number,
    name: string,
    cover_url?: string
  ): Promise<Board> {
    const board = await this.boardRepository.findOneBy({ id });
    if (!board) throw new Error("Board not found");

    board.name = name || board.name;
    board.cover_url = cover_url || board.cover_url;

    return await this.boardRepository.save(board);
  }

  async deleteBoard(id: number): Promise<void> {
    const board = await this.boardRepository.findOneBy({ id });
    if (!board) throw new Error("Board not found");
    await this.boardRepository.remove(board);
  }
}

export default new BoardModel();
