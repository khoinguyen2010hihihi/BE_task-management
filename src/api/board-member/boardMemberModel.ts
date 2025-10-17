import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { BoardMemberRole } from "@/common/entities/enums";

extendZodWithOpenApi(z);

export class BoardMemberModel {
  static BoardMemberSchema = z.object({
    boardId: z.string().uuid(),
    userId: z.string().uuid(),
    role: z.nativeEnum(BoardMemberRole),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  });

  static AddMemberSchema = z.object({
    params: z.object({
      id: z.string().uuid().openapi({ description: "Board ID" }),
    }),
    body: z.object({
      userId: z.string().uuid(),
      role: z.nativeEnum(BoardMemberRole),
    }),
  });

  static RemoveMemberSchema = z.object({
    params: z.object({
      id: z.string().uuid().openapi({ description: "Board ID" }),
      userId: z.string().uuid().openapi({ description: "User ID" }),
    }),
  });

  static ChangeRoleSchema = z.object({
    params: z.object({
      id: z.string().uuid().openapi({ description: "Board ID" }),
      userId: z.string().uuid().openapi({ description: "User ID" }),
    }),
    body: z.object({
      role: z.nativeEnum(BoardMemberRole),
    }),
  });
}

export type BoardMember = z.infer<typeof BoardMemberModel.BoardMemberSchema>;
export type AddMemberInput = z.infer<typeof BoardMemberModel.AddMemberSchema>["body"];
export type RemoveMemberInput = z.infer<typeof BoardMemberModel.RemoveMemberSchema>["params"];
export type ChangeRoleInput = z.infer<typeof BoardMemberModel.ChangeRoleSchema>["body"];
