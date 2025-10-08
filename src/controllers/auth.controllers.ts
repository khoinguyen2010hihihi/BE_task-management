import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";

class AuthController {
  async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await authService.loginUser(email, password);

      res.status(200).json({
        success: true,
        token,
        message: "Login success",
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
