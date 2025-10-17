import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { Visibility } from "@/common/entities/enums";

extendZodWithOpenApi(z);

export class BoardModel {
  static BoardSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    background: z.string().nullable().optional(),
    isClosed: z.boolean(),
    visibility: z.nativeEnum(Visibility),
    workspaceId: z.string().uuid(),
    createdById: z.string().uuid().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  static CreateBoardSchema = z.object({
    params: z.object({
      workspaceId: z.string().uuid(),
    }),
    body: z.object({
      name: z.string().min(3).max(100),
      slug: z.string().min(3).max(100),
      description: z.string().nullable().optional(),
      background: z.string().nullable().optional(),
      visibility: z.nativeEnum(Visibility).optional(),
    }),
  });

  static UpdateBoardSchema = z.object({
    params: z.object({
      workspaceId: z.string().uuid(),
      boardId: z.string().uuid(),
    }),
    body: z.object({
      name: z.string().min(3).max(100).optional(),
      slug: z.string().min(3).max(100).optional(),
      description: z.string().nullable().optional(),
      background: z.string().nullable().optional(),
      isClosed: z.boolean().optional(),
      visibility: z.nativeEnum(Visibility).optional(),
    }).refine((b) => Object.keys(b).length > 0, {
      message: "At least one field must be provided"
    }),
  });

  static DeleteBoardSchema = z.object({
    params: z.object({
      workspaceId: z.string().uuid(),
      boardId: z.string().uuid(),
    }),
  });
}

export type Board = z.infer<typeof BoardModel.BoardSchema>;
export type CreateBoardInput = z.infer<typeof BoardModel.CreateBoardSchema>["body"];
export type UpdateBoardInput = z.infer<typeof BoardModel.UpdateBoardSchema>["body"];
export type DeleteBoardInput = z.infer<typeof BoardModel.DeleteBoardSchema>["params"];
