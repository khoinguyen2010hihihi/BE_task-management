import { AppDataSource } from "@/configs/typeorm.config";
import { User } from '@/common/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { CreateUserInput } from "../user/userModel";

export class AuthRepository {
  private repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  async findByEmailAsync(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email })
  }
}

export const authRepository = new AuthRepository();