import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { ErrorResponse, InternalServerError, NotFoundError } from "../handler/error.response";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerError("Failed to fetch users");
    }
  }

  async getById(id: number): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new InternalServerError("Failed to fetch user");
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      const newUser = this.userRepository.create(userData);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerError("Failed to create user");
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundError("User not found");
      }
      Object.assign(user, userData);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new InternalServerError("Failed to update user");
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected && result.affected > 0) {
        return true;
      }
      throw new NotFoundError("User not found");
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new InternalServerError("Failed to delete user");
    }
  }
}
