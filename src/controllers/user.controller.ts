import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export class UserController {
  static async getUsers(req: Request, res: Response) {
    const users = await userService.getAll();
    res.json(users);
  }

  static async getUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const user = await userService.getById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }

  static async createUser(req: Request, res: Response) {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  }

  static async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const user = await userService.update(id, req.body);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }

  static async deleteUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const success = await userService.delete(id);
    if (!success) return res.status(404).json({ message: "User not found" });
    res.status(204).send();
  }
}
