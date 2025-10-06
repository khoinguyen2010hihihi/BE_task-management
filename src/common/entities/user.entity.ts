import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, Unique, } from 'typeorm';
import { DateTimeEntity } from './base/dateTimeEntity';
import { Workspace } from './workspace.entity';
import { Board } from './board.entity';
import { WorkspaceMember } from './workspace-member.entity';
import { BoardMember } from './board-member.entity';
import { Card } from './card.entity';
import { Comment } from './comment.entity';

@Entity('users')
@Unique(['email'])
export class User extends DateTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // citext để unique case-insensitive (cần extension citext)
  @Column({ type: 'citext' })
  @Index({ unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true, name: 'password_hash' })
  passwordHash!: string | null;

  @Column({ type: 'varchar', length: 150, name: 'full_name' })
  fullName!: string;

  @Column({ type: 'varchar', nullable: true, name: 'avatar_url' })
  avatarUrl!: string | null;

  @OneToMany(() => Workspace, (w) => w.owner)
  ownedWorkspaces!: Workspace[];

  @OneToMany(() => Board, (b) => b.createdBy)
  createdBoards!: Board[];

  @OneToMany(() => WorkspaceMember, (wm) => wm.user)
  workspaceMemberships!: WorkspaceMember[];

  @OneToMany(() => BoardMember, (bm) => bm.user)
  boardMemberships!: BoardMember[];

  @OneToMany(() => Card, (c) => c.createdBy)
  createdCards!: Card[];

  @OneToMany(() => Comment, (c) => c.author)
  comments!: Comment[];
}
