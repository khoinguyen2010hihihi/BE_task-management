import type { ErrorRequestHandler } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorResponse } from "./error.response";

// Handle all errors passed to next()
// Use for middleware and route handlers
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
