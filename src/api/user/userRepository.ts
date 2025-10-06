import { AppDataSource } from '@/configs/typeorm.config';
import { User } from '@/common/entities/user.entity';
import { CreateUserInput } from '@/api/user/userModel';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

export class UserRepository {
  private repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User)
  }

  async findAllAsync(): Promise<User[]> {
    return this.repo.find();
  }

  async findByIdAsync(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  async createAsync(payload: CreateUserInput): Promise<User> {
    const user = this.repo.create({
      email: payload.email,
      fullName: payload.fullName,
      passwordHash: await bcrypt.hash(payload.password, 10),
      avatarUrl: payload.avatarUrl || null,
    })
    return this.repo.save(user)
  }
}

export const userRepository = new UserRepository();
