import { config } from "dotenv"
import { DataSource } from 'typeorm';
import { User } from '@/common/entities/user.entity';
import { Workspace } from '@/common/entities/workspace.entity';
import { Board } from '@/common/entities/board.entity';
import { List } from '@/common/entities/list.entity';
import { Card } from '@/common/entities/card.entity';
import { Role } from '@/common/entities/role.entity';
import { Permission } from '@/common/entities/permission.entity';
import { RolePermission } from '@/common/entities/role-permission.entity';
import { WorkspaceMember } from '@/common/entities/workspace-member.entity';
import { BoardMember } from '@/common/entities/board-member.entity';
import { Comment } from '@/common/entities/comment.entity';

config()

const port = Number(process.env.DB_PORT)

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Board, List, Card, Role, Permission, RolePermission, WorkspaceMember, BoardMember, Comment, Workspace],
  migrationsTableName: "migrations",
  migrations: [],
  synchronize: true,
})