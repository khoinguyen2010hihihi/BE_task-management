import bcrypt from "bcrypt";
import authModel from "../model/auth.model";
import hashProvides from "../provides/hash.provides";
import userProvides from "../provides/user.provides";
import { User } from "../entities/user.entity";
import mailService from "./mail.service";
import { AppDataSource } from "../data-source";

class AuthService {
  async loginUser(email: string, password: string): Promise<string> {
    const user = await authModel.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    if (!user.isVerified) {
      throw new Error("Please verify your email before logging in");
    }

    const check = await hashProvides.compareHash(password, user.password!);
    if (!check) throw new Error("Incorrect password");

    return await userProvides.encodeToken(user);
  }

  async registerUser(
    email: string,
    password: string,
    userName: string
  ): Promise<string> {
    try {
      const existingUser = (await authModel.getUserByEmail(
        email
      )) as User | null;
      if (existingUser) {
        throw new Error("User already exists");
      }

      const { hashString } = await hashProvides.generateHash(password);

      const newUser = await authModel.createUser(email, hashString, userName);

      await mailService.sendVerificationEmail(
        newUser.email,
        newUser.verifyToken!
      );

      return "Registration success, please check your email to verify.";
    } catch (err) {
      throw err;
    }
  }
  async verifyEmail(token: string): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { verifyToken: token },
    });

    if (!user) {
      throw new Error("Invalid token");
    }
    user.isVerified = true;
    user.verifyToken = null;
    await userRepository.save(user);
  }
}

export default new AuthService();
