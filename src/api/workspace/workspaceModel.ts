import { Visibility } from "@/common/entities/enums";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export class WorkspaceModel {
  static WorkspaceSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    visibility: z.nativeEnum(Visibility),
    ownerId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date()
  }) 

  static GetWorkspaceSchema = z.object({
    params: z.object({
      id: z.string().uuid()
    })
  })

  static CreateWorkspaceSchema = z.object({
    name: z.string().min(3).max(100),
    slug: z.string().min(3).max(100),
    description: z.string().nullable().optional(),
    visibility: z.nativeEnum(Visibility).optional(),
  })

  static UpdateWorkspaceSchema = z.object({
    params: z.object({
      id: z.string().uuid()
    }),
    body: z.object({
      name: z.string().min(3).max(100).optional(),
      description: z.string().nullable().optional(),
      visibility: z.nativeEnum(Visibility).optional(),
    }).refine((b) => Object.keys(b).length > 0, {
      message: 'At least one field must be provided'
    })
  })

  static DeleteWorkspaceSchema = z.object({
    params: z.object({
      id: z.string().uuid()
    })
  })
}

export type Workspace = z.infer<typeof WorkspaceModel.WorkspaceSchema>;
export type GetWorkspaceInput = z.infer<typeof WorkspaceModel.GetWorkspaceSchema>['params'];
export type CreateWorkspaceInput = z.infer<typeof WorkspaceModel.CreateWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof WorkspaceModel.UpdateWorkspaceSchema>['body'];
export type DeleteWorkspaceInput = z.infer<typeof WorkspaceModel.DeleteWorkspaceSchema>['params'];