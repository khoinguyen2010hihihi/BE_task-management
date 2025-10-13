import { Request, Response, NextFunction } from "express";
import { Role, RolePermissions } from "../provides/constants";

export const authorize = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const role = user.role as Role;
    const permissions = RolePermissions[role] || [];

    if (!permissions.includes(requiredPermission)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};
