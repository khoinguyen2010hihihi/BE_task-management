import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { commonValidations } from '@/common/utils/commonValidation';
import e from 'cors';

extendZodWithOpenApi(z);

export class UserModel {
  static UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string(),
    avatarUrl: z.string().url().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  static GetUserSchema = z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
  });

  static CreateUserSchema = z.object({
    fullName: z.string().min(6).max(100),
    email: z.string().email(),
    password: z.string().min(6),
    avatarUrl: z.string().optional(),
  });

  static UpdateUserSchema = z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      fullName: z.string().max(100).optional().nullable(),
      avatarUrl: z.string().url().optional().nullable(),
    }).refine((b) => Object.keys(b).length > 0, {
      message: 'At least one field must be provided',
    }),
  });

  static DeleteUserSchema = z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
  });
}

export type User = z.infer<typeof UserModel.UserSchema>;
export type GetUserInput = z.infer<typeof UserModel.GetUserSchema>['params'];
export type CreateUserInput = z.infer<typeof UserModel.CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UserModel.UpdateUserSchema>['body'];
export type DeleteUserInput = z.infer<typeof UserModel.DeleteUserSchema>['params'];