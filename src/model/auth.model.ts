import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import crypto from "crypto";

class AuthModel {
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { email },
        select: [
          "id",
          "email",
          "password",
          "name",
          "isVerified",
          "verifyToken",
          "role",
          "refreshToken", 
        ],
      });

      return user;
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      throw new Error("Database query failed");
    }
  }

  async createUser(
    email: string,
    hashedPassword: string,
    userName: string
  ): Promise<User> {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const newUser = new User();
      newUser.email = email;
      newUser.password = hashedPassword;
      newUser.name = userName;
      newUser.isVerified = false;
      newUser.verifyToken = crypto.randomBytes(32).toString("hex");

      return await userRepository.save(newUser);
    } catch (error) {
      console.error("Error in createUser:", error);
      throw new Error("Failed to create user");
    }
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      await userRepository.update(userId, { refreshToken });
    } catch (error) {
      console.error("Error in updateRefreshToken:", error);
      throw new Error("Failed to update refresh token");
    }
  }

  async getUserByRefreshToken(refreshToken: string): Promise<User | null> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.findOne({ where: { refreshToken } });
    } catch (error) {
      console.error("Error in getUserByRefreshToken:", error);
      throw new Error("Failed to get user by refresh token");
    }
  }
}

export default new AuthModel();
