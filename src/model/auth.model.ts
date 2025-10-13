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
}

export default new AuthModel();
