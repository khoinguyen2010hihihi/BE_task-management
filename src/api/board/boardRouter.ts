import express, { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { BoardModel } from "./boardModel";
import { boardController } from "./boardController";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { validateRequest } from "@/common/utils/httpHandlers";
import { z } from "zod";

export const boardRegistry = new OpenAPIRegistry();

export class BoardRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    boardRegistry.register("Board", BoardModel.BoardSchema);
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.use(authMiddleware);

    boardRegistry.registerPath({
      method: "get",
      path: "/workspaces/{workspaceId}/boards",
      tags: ["Board"],
      responses: createApiResponse(BoardModel.BoardSchema.array(), "Success"),
    })
    this.router.get(
      "/:workspaceId/boards",
      asyncHandler(boardController.getAll.bind(boardController))
    );

    boardRegistry.registerPath({
      method: "get",
      path: "/workspaces/{workspaceId}/boards/{boardId}",
      tags: ["Board"],
      responses: createApiResponse(BoardModel.BoardSchema, "Success"),
    });
    this.router.get(
      "/:workspaceId/boards/:boardId",
      asyncHandler(boardController.getById.bind(boardController))
    );

    boardRegistry.registerPath({
      method: "post",
      path: "/workspaces/{workspaceId}/boards",
      tags: ["Board"],
      responses: createApiResponse(BoardModel.BoardSchema, "Created"),
    })
    this.router.post(
      "/:workspaceId/boards",
      validateRequest(BoardModel.CreateBoardSchema),
      asyncHandler(boardController.create.bind(boardController))
    );

    boardRegistry.registerPath({
      method: "put",
      path: "/workspaces/{workspaceId}/boards/{boardId}",
      tags: ["Board"],
      responses: createApiResponse(BoardModel.BoardSchema, "Updated"),
    });
    this.router.put(
      "/:workspaceId/boards/:boardId",
      validateRequest(BoardModel.UpdateBoardSchema),
      asyncHandler(boardController.update.bind(boardController))
    );

    boardRegistry.registerPath({
      method: "delete",
      path: "/workspaces/{workspaceId}/boards/{boardId}",
      tags: ["Board"],
      responses: createApiResponse(z.null(), "Deleted"),
    });
    this.router.delete(
      "/:workspaceId/boards/:boardId",
      validateRequest(BoardModel.DeleteBoardSchema),
      asyncHandler(boardController.delete.bind(boardController))
    );
  }
}

export const boardRouter = new BoardRouter().router;
