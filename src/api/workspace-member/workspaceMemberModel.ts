import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { WorkspaceMemberRole } from "@/common/entities/enums";

extendZodWithOpenApi(z);

export class WorkspaceMemberModel {
  static WorkspaceMemberSchema = z.object({
    workspaceId: z.string().uuid(),
    userId: z.string().uuid(),
    role: z.nativeEnum(WorkspaceMemberRole),
    invitedBy: z.string().uuid().nullable().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }); 

  static AddMemberSchema = z.object({
    params: z.object({
      id: z.string().uuid().openapi({ description: "Workspace ID" }),
    }),
    body: z.object({
      userId: z.string().uuid(),
      role: z.nativeEnum(WorkspaceMemberRole),
    }),
  });

  static RemoveMemberSchema = z.object({
    params: z.object({
      id: z.string().uuid().openapi({ description: "Workspace ID" }),
      userId: z.string().uuid().openapi({ description: "User ID" }),
    }),
  });

  static ChangeRoleSchema = z.object({
    params: z.object({
      id: z.string().uuid().openapi({ description: "Workspace ID" }),
      userId: z.string().uuid().openapi({ description: "User ID" }),
    }),
    body: z.object({
      role: z.nativeEnum(WorkspaceMemberRole),
    }),
  });
}

export type WorkspaceMember = z.infer<typeof WorkspaceMemberModel.WorkspaceMemberSchema>;
export type AddMemberInput = z.infer<typeof WorkspaceMemberModel.AddMemberSchema>["body"];
export type RemoveMemberInput = z.infer<typeof WorkspaceMemberModel.RemoveMemberSchema>["params"];
export type ChangeRoleInput = z.infer<typeof WorkspaceMemberModel.ChangeRoleSchema>["body"];
