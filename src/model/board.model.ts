import { AppDataSource } from "../data-source";
import { Board } from "../entities/board.entity";

const boardRepository = AppDataSource.getRepository(Board);

export default boardRepository;
