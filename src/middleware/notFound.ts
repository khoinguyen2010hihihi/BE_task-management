import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../handler/error.response";

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(new BadRequestError(`Not Found - ${req.originalUrl}`));
};

export default notFound;
