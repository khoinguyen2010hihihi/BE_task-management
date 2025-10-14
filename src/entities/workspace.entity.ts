import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Board } from "./board.entity";

@Entity("workspace")
export class workspace {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ default: false })
  is_delete!: boolean;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @OneToMany(() => Board, (board) => board.workspace)
  boards!: Board[];
}
