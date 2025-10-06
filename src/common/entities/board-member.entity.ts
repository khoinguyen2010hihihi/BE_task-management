import {
  Entity, ManyToOne, PrimaryColumn, Column, Index, Unique,
} from 'typeorm';
import { DateTimeEntity } from './base/dateTimeEntity';
import { Board } from './board.entity';
import { User } from './user.entity';
import { BoardMemberRole } from './enums';

@Entity('board_members')
@Unique(['boardId', 'userId'])
export class BoardMember extends DateTimeEntity {
  // PK composite: (board_id, user_id)
  @PrimaryColumn('uuid', { name: 'board_id' })
  @Index()
  boardId!: string;

  @PrimaryColumn('uuid', { name: 'user_id' })
  @Index()
  userId!: string;

  @ManyToOne(() => Board, (b) => b.members, { onDelete: 'CASCADE' })
  board!: Board;

  @ManyToOne(() => User, (u) => u.boardMemberships, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'enum', enum: BoardMemberRole })
  role!: BoardMemberRole;
}
