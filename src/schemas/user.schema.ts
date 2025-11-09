import { z } from "zod";

export const UserSchema = {
  GetById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, "User ID must be a number"),
    }),
  }),

  Create: z.object({
    body: z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.string().optional(),
    }),
  }),

  Update: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, "User ID must be a number"),
    }),
    body: z
      .object({
        name: z.string().min(2).max(100).optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        role: z.string().optional(),
      })
      .refine((b) => Object.keys(b).length > 0, {
        message: "At least one field must be provided",
      }),
  }),

  Delete: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, "User ID must be a number"),
    }),
  }),
};

export type CreateUserInput = z.infer<typeof UserSchema.Create>["body"];
export type UpdateUserInput = z.infer<typeof UserSchema.Update>["body"];
export type UserParams = z.infer<typeof UserSchema.GetById>["params"];
