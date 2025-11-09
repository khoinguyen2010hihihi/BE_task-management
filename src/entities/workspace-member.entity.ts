import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Workspace } from "./workspace.entity";

@Entity("workspace_members")
export class WorkspaceMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.workspaceMemberships, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "workspace_id" })
  workspace!: Workspace;

  @Column({ default: "member" })
  role!: "owner" | "admin" | "member" | "viewer";
}
