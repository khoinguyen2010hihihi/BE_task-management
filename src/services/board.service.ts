import boardRepository from "../model/board.model";
import { Board } from "../entities/board.entity";

class BoardService {
  async getAll(): Promise<Board[]> {
    return await boardRepository.find({ relations: ["workspace"] });
  }

  async getById(id: number): Promise<Board | null> {
    const board = await boardRepository.findOne({
      where: { id },
      relations: ["workspace"],
    });
    if (!board) throw new Error("Board not found");
    return board;
  }

  async createBoard(name: string, workspace_id: number, cover_url?: string) {
    const newBoard = boardRepository.create({
      name,
      workspace_id,
      cover_url: cover_url || null,
    });
    return await boardRepository.save(newBoard);
  }

  async updateBoard(
    id: number,
    name: string,
    cover_url?: string
  ): Promise<Board> {
    const board = await boardRepository.findOneBy({ id });
    if (!board) throw new Error("Board not found");

    board.name = name || board.name;
    board.cover_url = cover_url || board.cover_url;
    return await boardRepository.save(board);
  }

  async deleteBoard(id: number): Promise<void> {
    const board = await boardRepository.findOneBy({ id });
    if (!board) throw new Error("Board not found");
    await boardRepository.remove(board);
  }
}

export default new BoardService();
