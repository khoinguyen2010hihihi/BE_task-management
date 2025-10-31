import { Request, Response, NextFunction } from "express";
import { hasPermission } from "../utils/permissionChecker";
import { Permissions } from "../authorization/permissions/permissions.constant";
import { RoleScope } from "../entities/enums";
import { ServiceResponse, ResponseStatus } from "@/common/models/serviceResponse";

export const authorizationMiddleware = (
  scope: RoleScope, permission: Permissions
) => {
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const role = scope === RoleScope.WORKSPACE
        ? (user.workspaceRole || null)
        : (user.boardRole || null);

      if (!role || !hasPermission(scope, role, permission)) {
        return res.status(403).json({ message: "Forbidden: Role not found or insufficient permissions" });
      }

      const allowed = hasPermission(scope, role, permission);

      if (!allowed) {
        return res.status(403).json({ message: "Forbidden: Permission denied" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}