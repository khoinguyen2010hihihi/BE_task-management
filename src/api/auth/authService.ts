import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '@/common/utils/envConfig';
import { authRepository } from './authRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { RegisterInput, LoginInput, RefreshTokenInput } from './authModel';
import { instanceToInstance } from 'class-transformer';
import { logger } from '@/server';
import { User } from '@/common/entities/user.entity';
import { userRepository } from '../user/userRepository';

export class AuthService {
  private generateTokens(user: User) {
    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async register(userData: RegisterInput): Promise<ServiceResponse<any>> {
    try {
      const existing = await authRepository.findByEmailAsync(userData.email);
      if (existing) {
        return new ServiceResponse(ResponseStatus.Failed, 'Email already in use', null, StatusCodes.CONFLICT);
      }

      const newUser = await userRepository.createAsync(userData);
      const safeUser = instanceToInstance(newUser);

      return new ServiceResponse(ResponseStatus.Success, 'User registered successfully', { user: safeUser }, StatusCodes.CREATED);
    } catch (error) {
      const msg = `Error during register: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async login(data: LoginInput): Promise<ServiceResponse<any>> {
    try {
      const user = await authRepository.findByEmailAsync(data.email);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid email or password', null, StatusCodes.UNAUTHORIZED);
      }

      const match = await bcrypt.compare(data.password, user.passwordHash || '');
      if (!match) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid email or password', null, StatusCodes.UNAUTHORIZED);
      }

      const tokens = this.generateTokens(user);
      const safeUser = instanceToInstance(user);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Login successful',
        { user: safeUser, tokens },
        StatusCodes.OK
      );
    } catch (error) {
      const msg = `Error during login: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshToken(data: RefreshTokenInput): Promise<ServiceResponse<any>> {
    try {
      const decoded = jwt.verify(data.refreshToken, env.JWT_SECRET) as { id: string; email: string };
      const user = await authRepository.findByEmailAsync(decoded.email);

      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid refresh token', null, StatusCodes.UNAUTHORIZED);
      }

      const tokens = this.generateTokens(user);
      return new ServiceResponse(ResponseStatus.Success, 'Token refreshed successfully', tokens, StatusCodes.OK);
    } catch (error) {
      const msg = `Error refreshing token: ${(error as Error).message}`;
      logger.error(msg);
      return new ServiceResponse(ResponseStatus.Failed, msg, null, StatusCodes.UNAUTHORIZED);
    }
  }

  async logout(): Promise<ServiceResponse<null>> {
    return new ServiceResponse(ResponseStatus.Success, 'Logged out successfully', null, StatusCodes.OK);
  }
}

export const authService = new AuthService();