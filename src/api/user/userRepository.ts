import { AppDataSource } from '@/configs/typeorm.config';
import { User } from '@/common/entities/user.entity';
import { CreateUserInput, UpdateUserInput } from '@/api/user/userModel';
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

  async createAsync(payload: CreateUserInput & { passwordHash: string }): Promise<User> {
    const user = this.repo.create({
      email: payload.email,
      fullName: payload.fullName,
      passwordHash: payload.passwordHash,
      avatarUrl: payload.avatarUrl || null,
    })
    return this.repo.save(user)
  }

  async updateAsync(id: string, payload: Partial<UpdateUserInput & { passwordHash?: string }>): Promise<User | null> {
    const user = await this.repo.findOneBy({ id })
    if (!user) return null

    if (payload.email) user.email = payload.email
    if (payload.fullName) user.fullName = payload.fullName
    if (payload.avatarUrl !== undefined) user.avatarUrl = payload.avatarUrl
    if (payload.passwordHash) user.passwordHash = payload.passwordHash

    return this.repo.save(user)
  }   
}

export const userRepository = new UserRepository();
