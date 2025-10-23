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

  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, userName } = req.body;
      const user = await authService.registerUser(email, password, userName);
      res.status(200).json({
        success: true,
        user,
        message: "Register success",
      });
    } catch (err) {
      next(err);
    }
  }
  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { token } = req.query;

    if (!token) {
      res.status(400).json({ message: "Missing token" });
      return;
    }

    try {
      await authService.verifyEmail(token as string);
      res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
      res.status(400).json({ message: "Invalid or expired token" });
    }
  }
}

export default new AuthController();
