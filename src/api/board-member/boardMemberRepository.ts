import { AppDataSource } from "@/configs/typeorm.config";
import { Repository } from "typeorm";
import { BoardMember } from "@/common/entities/board-member.entity";
import { User } from "@/common/entities/user.entity";
import { Board } from "@/common/entities/board.entity";
import { BoardMemberRole } from "@/common/entities/enums";
import { AddMemberInput, ChangeRoleInput } from "./boardMemberModel";

export class BoardMemberRepository {
  private repo: Repository<BoardMember>;

  constructor() {
    this.repo = AppDataSource.getRepository(BoardMember);
  }

  async findAllByBoardId(boardId: string): Promise<BoardMember[]> {
    return this.repo.find({
      where: { boardId },
      relations: ["user"],
      order: { createdAt: "ASC" },
    });
  }

  async addMember(board: Board, user: User, payload: AddMemberInput): Promise<BoardMember> {
    const member = this.repo.create({
      boardId: board.id,
      userId: user.id,
      board,
      user,
      role: payload.role as BoardMemberRole,
    });
    return this.repo.save(member);
  }

  async removeMember(boardId: string, userId: string): Promise<boolean> {
    const result = await this.repo.delete({ boardId, userId });
    return result.affected !== 0;
  }

  async changeRole(boardId: string, userId: string, payload: ChangeRoleInput): Promise<BoardMember | null> {
    const member = await this.repo.findOne({ where: { boardId, userId }, relations: ["user"] });
    if (!member) return null;

    member.role = payload.role as BoardMemberRole;
    return this.repo.save(member);
  }
}

export const boardMemberRepository = new BoardMemberRepository();
