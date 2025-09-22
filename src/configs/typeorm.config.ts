import { config } from "dotenv"
import { DataSource } from 'typeorm';
import { Project } from "@/common/entities/project.entity";
import { User } from "@/common/entities/user.entity";
import { Board } from "@/common/entities/board.entity";
import { ProjectMembers } from "@/common/entities/projectmembers.entity";

config()

const port = Number(process.env.DB_PORT)

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Project, User, Board, ProjectMembers],
  migrationsTableName: "migrations",
  migrations: [],
  synchronize: false,
})