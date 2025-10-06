import { DateTimeEntity } from './base/dateTimeEntity';
import {
  Entity, ManyToOne, PrimaryColumn, Column, Index, Unique,
} from 'typeorm';
import { Workspace } from './workspace.entity';
import { User } from './user.entity';
import { WorkspaceMemberRole } from './enums';

@Entity('workspace_members')
@Unique(['workspaceId', 'userId'])
export class WorkspaceMember extends DateTimeEntity {
  // PK composite: (workspace_id, user_id)
  @PrimaryColumn('uuid', { name: 'workspace_id' })
  @Index()
  workspaceId!: string;

  @PrimaryColumn('uuid', { name: 'user_id' })
  @Index()
  userId!: string;

  @ManyToOne(() => Workspace, (w) => w.members, { onDelete: 'CASCADE' })
  workspace!: Workspace;

  @ManyToOne(() => User, (u) => u.workspaceMemberships, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'enum', enum: WorkspaceMemberRole })
  role!: WorkspaceMemberRole;

  @Column({ type: 'uuid', nullable: true, name: 'invited_by' })
  invitedBy!: string | null;
}
