import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

class AuthModel {
  async getUserByEmail(email: string) {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { email },
        select: ["email"],
      });

      return user;
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      throw new Error("Database query failed");
    }
  }
}

export default new AuthModel();
