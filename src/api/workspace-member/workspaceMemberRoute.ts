import express, { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { WorkspaceMemberModel } from "./workspaceMemberModel";
import { workspaceMemberController } from "./workspaceMemberController";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { validateRequest } from "@/common/utils/httpHandlers";

export const workspaceMemberRegistry = new OpenAPIRegistry();

export class WorkspaceMemberRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    workspaceMemberRegistry.register("WorkspaceMember", WorkspaceMemberModel.WorkspaceMemberSchema);
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.use(authMiddleware);

    // Add member
    workspaceMemberRegistry.registerPath({
      method: "post",
      path: "/{id}",
      tags: ["Workspace Members"],
      request: {
        params: WorkspaceMemberModel.AddMemberSchema.shape.params,
        body: { content: { "application/json": { schema: WorkspaceMemberModel.AddMemberSchema.shape.body } } },
      },
      responses: createApiResponse(WorkspaceMemberModel.WorkspaceMemberSchema, "Member added"),
    });
    this.router.post(
      "/:id",
      validateRequest(WorkspaceMemberModel.AddMemberSchema),
      asyncHandler(workspaceMemberController.addMember.bind(workspaceMemberController))
    );

    // Remove member
    workspaceMemberRegistry.registerPath({
      method: "delete",
      path: "/{id}/members/{userId}",
      tags: ["Workspace Members"],
      request: { params: WorkspaceMemberModel.RemoveMemberSchema.shape.params },
      responses: createApiResponse(WorkspaceMemberModel.WorkspaceMemberSchema, "Member removed"),
    });
    this.router.delete(
      "/:id/members/:userId",
      validateRequest(WorkspaceMemberModel.RemoveMemberSchema),
      asyncHandler(workspaceMemberController.removeMember.bind(workspaceMemberController))
    );

    // Change role
    workspaceMemberRegistry.registerPath({
      method: "put",
      path: "/{id}/members/{userId}/role",
      tags: ["Workspace Members"],
      request: {
        params: WorkspaceMemberModel.ChangeRoleSchema.shape.params,
        body: { content: { "application/json": { schema: WorkspaceMemberModel.ChangeRoleSchema.shape.body } } },
      },
      responses: createApiResponse(WorkspaceMemberModel.WorkspaceMemberSchema, "Role updated"),
    });
    this.router.put(
      "/:id/members/:userId/role",
      validateRequest(WorkspaceMemberModel.ChangeRoleSchema),
      asyncHandler(workspaceMemberController.changeRole.bind(workspaceMemberController))
    );
  }
}

export const workspaceMemberRouter = new WorkspaceMemberRouter().router;
