import { userService } from "./userService";
import { Request, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

export class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    const serviceResponse = await userService.findAll();
    handleServiceResponse(serviceResponse, res)
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const serviceResponse = await userService.findById(id);
    handleServiceResponse(serviceResponse, res)
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const userData = req.body
    const serviceResponse = await userService.create(userData);
    handleServiceResponse(serviceResponse, res)
  }
}

export const userController = new UserController();