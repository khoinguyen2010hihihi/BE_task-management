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

      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
        return;
      }

      const { accessToken, refreshToken } = await authService.loginUser(
        email,
        password
      );

      res.status(200).json({
        success: true,
        message: "Login success",
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res
          .status(400)
          .json({ success: false, message: "Refresh token is required" });
        return;
      }

      const { accessToken } = await authService.refreshAccessToken(
        refreshToken
      );

      res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken,
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

  async getInformation(req: Request, res: Response, next: NextFunction): Promise<void>{
    try{
      const userPayload = (req as any).user;
      if (!userPayload){
        res.status(401).json({message: "Unauthorized"});
        return;
      }
      const user = await authService.getUserInformation(userPayload.id);
      res.status(200).json({success: true, result: user});

    } catch(err){
      next(err);
    }
  }
}

export default new AuthController();
