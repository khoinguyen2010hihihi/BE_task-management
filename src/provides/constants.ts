export enum Role {
  ADMIN = "admin",
  STAFF = "staff",
  USER = "user",
}

export const RolePermissions: Record<Role, string[]> = {
  [Role.ADMIN]: ["create_user", "delete_user", "update_user", "view_all", "view_self"],
  [Role.STAFF]: ["update_user", "view_all", "view_self"],
  [Role.USER]: ["view_self"],
};
