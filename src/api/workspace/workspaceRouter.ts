import express, { Router } from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { WorkspaceModel } from './workspaceModel';
import { workspaceController } from './workspaceController';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { validateRequest } from '@/common/utils/httpHandlers';
import { asyncHandler } from '@/common/middleware/asyncHandler';
import { z } from 'zod';
import { authMiddleware } from '@/common/middleware/authMiddleware';

export const workspaceRegistry = new OpenAPIRegistry();

export class WorkspaceRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    workspaceRegistry.register('Workspace', WorkspaceModel.WorkspaceSchema);
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.use(authMiddleware);

    workspaceRegistry.registerPath({
      method: 'get',
      path: '/workspaces',
      tags: ['Workspace'],
      responses: createApiResponse(WorkspaceModel.WorkspaceSchema.array(), 'Success'),
    });
    this.router.get('/', asyncHandler(workspaceController.getAllWorkspaces.bind(workspaceController)));

    workspaceRegistry.registerPath({
      method: 'get',
      path: '/workspaces/{id}',
      tags: ['Workspace'],
      request: { params: WorkspaceModel.GetWorkspaceSchema.shape.params },
      responses: createApiResponse(WorkspaceModel.WorkspaceSchema, 'Success'),
    });
    this.router.get(
      '/:id',
      validateRequest(WorkspaceModel.GetWorkspaceSchema),
      asyncHandler(workspaceController.getWorkspaceById.bind(workspaceController))
    );

    workspaceRegistry.registerPath({
      method: 'post',
      path: '/workspaces',
      tags: ['Workspace'],
      request: {
        body: {
          content: { 'application/json': { schema: WorkspaceModel.CreateWorkspaceSchema } },
        },
      },
      responses: createApiResponse(WorkspaceModel.WorkspaceSchema, 'Created'),
    });
    this.router.post('/', asyncHandler(workspaceController.createWorkspace.bind(workspaceController)));

    workspaceRegistry.registerPath({
      method: 'put',
      path: '/workspaces/{id}',
      tags: ['Workspace'],
      request: {
        params: WorkspaceModel.UpdateWorkspaceSchema.shape.params,
        body: { content: { 'application/json': { schema: WorkspaceModel.UpdateWorkspaceSchema } } },
      },
      responses: createApiResponse(WorkspaceModel.WorkspaceSchema, 'Updated'),
    });
    this.router.put('/:id', asyncHandler(workspaceController.updateWorkspace.bind(workspaceController)));

    workspaceRegistry.registerPath({
      method: 'delete',
      path: '/workspaces/{id}',
      tags: ['Workspace'],
      request: { params: WorkspaceModel.DeleteWorkspaceSchema.shape.params },
      responses: createApiResponse(z.null(), 'Deleted'),
    });
    this.router.delete('/:id', asyncHandler(workspaceController.deleteWorkspace.bind(workspaceController)));
  }
}

export const workspaceRouter = new WorkspaceRouter().router;
