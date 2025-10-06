import express, { Router } from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { UserModel } from './userModel';
import { userController } from './userController';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { validateRequest } from '@/common/utils/httpHandlers';

export const userRegistry = new OpenAPIRegistry();
export class UserRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    userRegistry.register('User', UserModel.UserSchema);
    this.registerRoutes();
  }

  private registerRoutes() {
    userRegistry.registerPath({
      method: 'get',
      path: '/users',
      tags: ['User'],
      responses: createApiResponse(UserModel.UserSchema.array(), 'Success'),
    });

    this.router.get('/', (req, res) => userController.getAllUsers(req, res));

    userRegistry.registerPath({
      method: 'get',
      path: '/users/{id}',
      tags: ['User'],
      request: { params: UserModel.GetUserSchema.shape.params },
      responses: createApiResponse(UserModel.UserSchema, 'Success'),
    });

    this.router.get('/:id', validateRequest(UserModel.GetUserSchema), (req, res) => userController.getUserById(req, res));

    userRegistry.registerPath({
      method: 'post',
      path: '/users',
      tags: ['User'],
      request: { 
        body: {
          content: {
            'application/json': {
              schema: UserModel.CreateUserSchema.shape.body,
            },
          },
        },
      },
      responses: createApiResponse(UserModel.UserSchema, 'Created'),
    });

    this.router.post('/', validateRequest(UserModel.CreateUserSchema), (req, res) => userController.createUser(req, res));
  }
}

export const userRouter = new UserRouter().router;