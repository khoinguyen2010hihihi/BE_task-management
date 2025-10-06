import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index, Unique,
} from 'typeorm';
import { DateTimeEntity } from './base/dateTimeEntity';
import { Visibility } from './enums';
import { Workspace } from './workspace.entity';
import { User } from './user.entity';
import { List } from './list.entity'
import { BoardMember } from './board-member.entity';

@Entity('boards')
@Unique(['workspace', 'slug']) // unique trong workspace
export class Board extends DateTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Workspace, (w) => w.boards, { onDelete: 'CASCADE', nullable: false })
  @Index()
  workspace!: Workspace;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', nullable: true })
  background!: string | null;

  @Column({ type: 'boolean', default: false, name: 'is_closed' })
  isClosed!: boolean;

  @Column({ type: 'enum', enum: Visibility, default: Visibility.PRIVATE })
  visibility!: Visibility;

  @ManyToOne(() => User, (u) => u.createdBoards, { onDelete: 'SET NULL', nullable: true, eager: false })
  @Index()
  createdBy!: User | null;

  @OneToMany(() => List, (l) => l.board)
  lists!: List[];

  @OneToMany(() => BoardMember, (bm) => bm.board)
  members!: BoardMember[];
}
