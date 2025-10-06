import { StatusCodes } from 'http-status-codes';
import { CreateUserInput, User } from '@/api/user/userModel';
import { userRepository } from '@/api/user/userRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { instanceToInstance } from 'class-transformer';

export class UserService {
  async findAll(): Promise<ServiceResponse<User[] | null>> {
    try {
      const users = await userRepository.findAllAsync()
      if (!users || users.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Users found', null, StatusCodes.NOT_FOUND)
      }
      return new ServiceResponse<User[]>(ResponseStatus.Success, 'Users found', users, StatusCodes.OK)
    } catch (err) {
      const errorMessage = `Error finding all users: ${(err as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: string): Promise<ServiceResponse<User | null>> {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (err) {
      const errorMessage = `Error finding user with id ${id}: ${(err as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(userData: CreateUserInput): Promise<ServiceResponse<User | null>> {
    try {
      const newUser = await userRepository.createAsync(userData);
      const safeUser = instanceToInstance(newUser)
      return new ServiceResponse<User>(ResponseStatus.Success, 'User created successfully', safeUser, StatusCodes.CREATED);
    } catch (error) {
      const errorMessage = `Error creating user: ${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userService = new UserService();
