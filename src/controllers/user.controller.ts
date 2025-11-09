import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  ServiceResponse,
  ResponseStatus,
} from "../provides/service.response";
import {
  BadRequestError,
  NotFoundError,
} from "../handler/error.response";
import { handleServiceResponse } from "../utils/http-handler";

const userService = new UserService();

class UserController {
  static async getUsers(_req: Request, res: Response) {
    const users = await userService.getAll();
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Sucess,
        "Users fetched successfully",
        users,
        200
      ),
      res
    );
  }

  static async getUser(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new BadRequestError("Invalid user id");
    }
    const user = await userService.getById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Sucess,
        "User fetched successfully",
        user,
        200
      ),
      res
    );
  }

  static async createUser(req: Request, res: Response) {
    const user = await userService.create(req.body);
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Sucess,
        "User created successfully",
        user,
        201
      ),
      res
    );
  }

  static async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new BadRequestError("Invalid user id");
    }
    const user = await userService.update(id, req.body);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Sucess,
        "User updated successfully",
        user,
        200
      ),
      res
    );
  }

  static async deleteUser(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new BadRequestError("Invalid user id");
    }
    await userService.delete(id);
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Sucess,
        "User deleted successfully",
        null,
        200
      ),
      res
    );
  }
}

export default UserController;