import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "user" })
  role!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ type: "varchar", nullable: true })
  verifyToken!: string | null;
}
