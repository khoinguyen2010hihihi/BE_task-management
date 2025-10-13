import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export class AuthModel {
  static LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })

  static RegisterSchema = z.object({
    email: z.string().email(),
    fullName: z.string(),
    avatarUrl: z.string().url().optional().nullable(),
    password: z.string().min(6)
  })

  static RefreshTokenSchema = z.object({
    refreshToken: z.string().min(10)
  })

  static TokenResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  })
}

export type LoginInput = z.infer<typeof AuthModel.LoginSchema>
export type RegisterInput = z.infer<typeof AuthModel.RegisterSchema>
export type RefreshTokenInput = z.infer<typeof AuthModel.RefreshTokenSchema>