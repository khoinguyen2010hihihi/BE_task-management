import bcrypt from "bcrypt";
import authModel from "../model/auth.model";
import hashProvides from "../provides/hash.provides";
import userProvides from "../provides/user.provides";
import { User } from "../entities/user.entity";

class AuthService {
  async loginUser(email: string, password: string): Promise<string> {
    try {
      const user = (await authModel.getUserByEmail(email)) as User | null;

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.password) {
        throw new Error("Password not found in database");
      }

      const check = await hashProvides.compareHash(password, user.password);

      if (!check) {
        throw new Error("Login unsuccess");
      }

      const token = await userProvides.encodeToken(user);
      return token;
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
