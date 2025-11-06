import bcrypt from "bcrypt";
import authModel from "../model/auth.model";
import hashProvides from "../provides/hash.provides";
import { userProvides } from "../provides/user.provides";
import { User } from "../entities/user.entity";
import mailService from "./mail.service";
import { AppDataSource } from "../data-source";

class AuthService {
  async loginUser(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await authModel.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    if (!user.isVerified) {
      throw new Error("Please verify your email before logging in");
    }

    const check = await hashProvides.compareHash(password, user.password!);
    if (!check) throw new Error("Incorrect password");

    const accessToken = await userProvides.encodeToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    const refreshToken = await userProvides.encodeRefreshToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    user.refreshToken = refreshToken;
    await authModel.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async registerUser(
    email: string,
    password: string,
    name: string
  ): Promise<string> {
    try {
      const existingUser = (await authModel.getUserByEmail(
        email
      )) as User | null;
      if (existingUser) {
        throw new Error("User already exists");
      }

      const { hashString } = await hashProvides.generateHash(password);

      const newUser = await authModel.createUser(email, hashString, name);

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

  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    try {
      if (!refreshToken) {
        throw new Error("Refresh token is required");
      }

      const decoded = await userProvides.verifyRefreshToken(refreshToken);

      const user = await authModel.getUserByRefreshToken(refreshToken);
      if (!user) {
        throw new Error("Invalid refresh token");
      }

      const accessToken = await userProvides.encodeToken({
        id: user.id,
        role: user.role,
        email: user.email,
      });

      return { accessToken };
    } catch (err) {
      console.error("Error in refreshAccessToken:", err);
      throw new Error("Invalid or expired refresh token");
    }
  }

  async getUserInformation(userId: number): Promise<User | null>{
    const user = await authModel.getUserById(userId);
    if (!user){
      throw new Error("User not found");
    }
    return user;
  }
}

export default new AuthService();
