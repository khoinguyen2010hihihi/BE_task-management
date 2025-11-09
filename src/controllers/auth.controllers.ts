import { Request, Response } from "express";
import authService from "../services/auth.service";
import {
  ServiceResponse,
  ResponseStatus,
} from "../provides/service.response";
import {
  BadRequestError,
  ForbiddenError,
} from "../handler/error.response";
import { handleServiceResponse } from "../utils/http-handler";

class AuthController {
  loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const { accessToken, refreshToken } = await authService.loginUser(
      email,
      password
    );
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Sucess,
        "Login success",
        { accessToken, refreshToken },
        200
      ),
      res
    );
  };

  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    const { accessToken } = await authService.refreshAccessToken(refreshToken);
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Sucess,
        "Access token refreshed successfully",
        { accessToken },
        200
      ),
      res
    );
  };

  registerUser = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const user = await authService.registerUser(email, password, name);
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Sucess,
        "Register success",
        user,
        201
      ),
      res
    );
  };

  verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token) {
      throw new BadRequestError("Missing token");
    }

    await authService.verifyEmail(token as string);
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Sucess,
        "Email verified successfully",
        null,
        200
      ),
      res
    );
  };

  getInformation = async (req: Request, res: Response) => {
    const userPayload = (req as any).user;
    if (!userPayload) {
      throw new ForbiddenError("Unauthorized access");
    }
    const user = await authService.getUserInformation(userPayload.id);
    return handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Sucess,
        "Fetched user information",
        user,
        200
      ),
      res
    );
  };
}

export default new AuthController();
