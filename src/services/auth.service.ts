import authModel from "../model/auth.model";
import hashProvides from "../provides/hash.provides";
import { userProvides } from "../provides/user.provides";
import { User } from "../entities/user.entity";
import mailService from "./mail.service";
import { AppDataSource } from "../data-source";
import { BadRequestError, ForbiddenError, InternalServerError, AuthFailureError, ErrorResponse } from "../handler/error.response";

class AuthService {
  async loginUser(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const user = await authModel.getUserByEmail(email);
      if (!user) {
        throw new BadRequestError("User not found");
      }

      if (!user.isVerified) {
        throw new ForbiddenError(
          "Please verify your email before logging in"
        );
      }

      const check = await hashProvides.compareHash(password, user.password!);
      if (!check) {
        throw new AuthFailureError("Incorrect password");
      }

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
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new InternalServerError("Failed to login user");
    }
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
        throw new ErrorResponse("User already exists", 409);
      }

      const { hashString } = await hashProvides.generateHash(password);

      const newUser = await authModel.createUser(email, hashString, name);

      await mailService.sendVerificationEmail(
        newUser.email,
        newUser.verifyToken!
      );

      return "Registration success, please check your email to verify.";
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new InternalServerError("Failed to register user");
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { verifyToken: token },
      });

      if (!user) {
        throw new BadRequestError("Invalid token");
      }
      user.isVerified = true;
      user.verifyToken = null;
      await userRepository.save(user);
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new InternalServerError("Failed to verify email");
    }
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    try {
      if (!refreshToken) {
        throw new BadRequestError("Refresh token is required");
      }

      await userProvides.verifyRefreshToken(refreshToken);

      const user = await authModel.getUserByRefreshToken(refreshToken);
      if (!user) {
        throw new ErrorResponse("Invalid refresh token", 401);
      }

      const accessToken = await userProvides.encodeToken({
        id: user.id,
        role: user.role,
        email: user.email,
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new AuthFailureError("Invalid or expired refresh token");
    }
  }

  async getUserInformation(userId: number): Promise<User | null> {
    try {
      const user = await authModel.getUserById(userId);
      if (!user) {
        throw new ErrorResponse("User not found", 404);
      }
      return user;
    } catch (error) {
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new InternalServerError("Failed to fetch user information");
    }
  }
}

export default new AuthService();
