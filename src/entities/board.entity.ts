import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { workspace } from "./workspace.entity";

@Entity("boards")
export class Board {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "varchar", nullable: true })
  cover_url!: string | null;

  @ManyToOne(() => workspace, (workspace) => workspace.boards, {
    onDelete: "CASCADE",
  })
  workspace!: workspace;

  @Column()
  workspace_id!: number;

  @Column({ nullable: true })
  card_id!: number | null;

  @CreateDateColumn()
  create_at!: Date;

  @UpdateDateColumn()
  update_at!: Date;
}
