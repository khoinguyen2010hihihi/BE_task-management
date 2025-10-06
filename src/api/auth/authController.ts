import { Request, Response } from 'express';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { authService } from './authService';

export class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    handleServiceResponse(result, res);
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    handleServiceResponse(result, res);
  }

  async refresh(req: Request, res: Response) {
    const result = await authService.refreshToken(req.body);
    handleServiceResponse(result, res);
  }

  async logout(req: Request, res: Response) {
    const result = await authService.logout();
    handleServiceResponse(result, res);
  }
}

export const authController = new AuthController();
