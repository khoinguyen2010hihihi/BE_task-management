import express, { Router } from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { asyncHandler } from '@/common/middleware/asyncHandler';
import { validateRequest } from '@/common/utils/httpHandlers';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { AuthModel } from './authModel';
import { authController } from './authController';
import { z } from 'zod';

export const authRegistry = new OpenAPIRegistry();

export class AuthRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    // Register
    authRegistry.registerPath({
      method: 'post',
      path: '/auth/register',
      tags: ['Auth'],
      request: {
        body: { content: { 'application/json': { schema: AuthModel.RegisterSchema } } },
      },
      responses: createApiResponse(AuthModel.TokenResponseSchema, 'Registered'),
    });
    this.router.post('/register', asyncHandler(authController.register.bind(authController)));

    // Login
    authRegistry.registerPath({
      method: 'post',
      path: '/auth/login',
      tags: ['Auth'],
      request: {
        body: { content: { 'application/json': { schema: AuthModel.LoginSchema } } },
      },
      responses: createApiResponse(AuthModel.TokenResponseSchema, 'Logged in'),
    });
    this.router.post('/login', asyncHandler(authController.login.bind(authController)));

    // Refresh Token
    authRegistry.registerPath({
      method: 'post',
      path: '/auth/refresh-token',
      tags: ['Auth'],
      request: {
        body: { content: { 'application/json': { schema: AuthModel.RefreshTokenSchema } } },
      },
      responses: createApiResponse(AuthModel.TokenResponseSchema, 'Token refreshed'),
    });
    this.router.post('/refresh-token', asyncHandler(authController.refresh.bind(authController)));

    // Logout
    authRegistry.registerPath({
      method: 'post',
      path: '/auth/logout',
      tags: ['Auth'],
      responses: createApiResponse(z.object({ message: z.string() }), 'Logged out'),
    });
    this.router.post('/logout', asyncHandler(authController.logout.bind(authController)));
  }
}

export const authRouter = new AuthRouter().router;
