import { DateTimeEntity } from './base/dateTimeEntity';
import {
  Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, OneToMany, Unique,
} from 'typeorm';
import { Visibility } from './enums';
import { User } from './user.entity';
import { Board } from './board.entity';
import { WorkspaceMember } from './workspace-member.entity';

@Entity('workspaces')
@Unique(['slug'])
export class Workspace extends DateTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  @Index({ unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'enum', enum: Visibility, default: Visibility.PRIVATE })
  visibility!: Visibility;

  @ManyToOne(() => User, (u) => u.ownedWorkspaces, { onDelete: 'RESTRICT', nullable: false })
  owner!: User;

  @OneToMany(() => Board, (b) => b.workspace)
  boards!: Board[];

  @OneToMany(() => WorkspaceMember, (wm) => wm.workspace)
  members!: WorkspaceMember[];
}
