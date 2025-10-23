import { Request, Response, NextFunction } from "express";
import Joi from "joi";

class ValidateMiddleware {
  async validateLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      });

      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error && (error as Joi.ValidationError).details) {
        const details = (error as Joi.ValidationError).details.map(
          (e) => e.message
        );
        res.status(400).json({
          success: false,
          message: "Invalid login data",
          details,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid login data",
        });
      }
    }
  }

  async validateResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        newPassword: Joi.string().min(6).required(),
        passwordResetToken: Joi.string().required(),
      });

      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error && (error as Joi.ValidationError).details) {
        const details = (error as Joi.ValidationError).details.map(
          (e) => e.message
        );
        res.status(400).json({
          success: false,
          message: "Invalid reset password data",
          details,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid reset password data",
        });
      }
    }
  }
}

export default new ValidateMiddleware();
