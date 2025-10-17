import { AppDataSource } from "@/configs/typeorm.config";
import { Repository } from "typeorm";
import { Board } from "@/common/entities/board.entity";
import { Workspace } from "@/common/entities/workspace.entity";
import { User } from "@/common/entities/user.entity";
import { CreateBoardInput, UpdateBoardInput } from "./boardModel";

export class BoardRepository {
  private repo: Repository<Board>;

  constructor() {
    this.repo = AppDataSource.getRepository(Board);
  }

  async findAllByWorkspaceAsync(workspaceId: string): Promise<Board[]> {
    return this.repo.find({
      where: { workspace: { id: workspaceId } },
      relations: ["workspace", "createdBy"],
      order: { createdAt: "ASC" },
    });
  }

  async findByIdAsync(boardId: string): Promise<Board | null> {
    return this.repo.findOne({
      where: { id: boardId },
      relations: ["workspace", "createdBy"],
    });
  }

  async createAsync(payload: CreateBoardInput, workspace: Workspace, creator: User): Promise<Board> {
    const board = this.repo.create({
      ...payload,
      workspace,
      createdBy: creator,
    });
    return this.repo.save(board);
  }

  async updateAsync(boardId: string, payload: UpdateBoardInput): Promise<Board | null> {
    const existing = await this.findByIdAsync(boardId);
    if (!existing) return null;

    Object.assign(existing, payload);
    return this.repo.save(existing);
  }

  async deleteAsync(boardId: string): Promise<boolean> {
    const result = await this.repo.delete({ id: boardId });
    return result.affected !== 0;
  }
}

export const boardRepository = new BoardRepository();
