import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async getById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: id });
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      return null;
    }
    Object.assign(user, userData);
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    if (result.affected && result.affected > 0) {
      return true;
    }
    return false;
  }
}
