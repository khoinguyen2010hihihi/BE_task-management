import express, { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { BoardMemberModel } from "./boardMemberModel";
import { boardMemberController } from "./boardMemberController";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { validateRequest } from "@/common/utils/httpHandlers";

export const boardMemberRegistry = new OpenAPIRegistry();

export class BoardMemberRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    boardMemberRegistry.register("BoardMember", BoardMemberModel.BoardMemberSchema);
    this.registerRoutes();
  }

  private registerRoutes() {

    this.router.use(authMiddleware);

    // Add member
    boardMemberRegistry.registerPath({
      method: "post",
      path: "/:id",
      tags: ["Board Members"],
      request: {
        params: BoardMemberModel.AddMemberSchema.shape.params,
        body: { content: { "application/json": { schema: BoardMemberModel.AddMemberSchema.shape.body } } },
      },
      responses: createApiResponse(BoardMemberModel.BoardMemberSchema, "Member added"),
    });
    this.router.post(
      "/:id",
      validateRequest(BoardMemberModel.AddMemberSchema),
      asyncHandler(boardMemberController.addMember.bind(boardMemberController))
    );

    // Remove member
    boardMemberRegistry.registerPath({
      method: "delete",
      path: "/:id/members/:userId",
      tags: ["Board Members"],
      request: { params: BoardMemberModel.RemoveMemberSchema.shape.params },
      responses: createApiResponse(BoardMemberModel.BoardMemberSchema, "Member removed"),
    });
    this.router.delete(
      "/:id/members/:userId",
      validateRequest(BoardMemberModel.RemoveMemberSchema),
      asyncHandler(boardMemberController.removeMember.bind(boardMemberController))
    );

    // Change role
    boardMemberRegistry.registerPath({
      method: "put",
      path: "/:id/members/:userId/role",
      tags: ["Board Members"],
      request: {
        params: BoardMemberModel.ChangeRoleSchema.shape.params,
        body: { content: { "application/json": { schema: BoardMemberModel.ChangeRoleSchema.shape.body } } },
      },
      responses: createApiResponse(BoardMemberModel.BoardMemberSchema, "Role changed"),
    });
    this.router.put(
      "/:id/members/:userId/role",
      validateRequest(BoardMemberModel.ChangeRoleSchema),
      asyncHandler(boardMemberController.changeRole.bind(boardMemberController))
    );

    // Get all members
    boardMemberRegistry.registerPath({
      method: "get",
      path: "/:id/members",
      tags: ["Board Members"],
      responses: createApiResponse(BoardMemberModel.BoardMemberSchema.array(), "Success"),
    });

    this.router.get(
      "/:id/members",
      asyncHandler(boardMemberController.getAllMembers.bind(boardMemberController))
    );
  }
}

export const boardMemberRouter = new BoardMemberRouter().router;
