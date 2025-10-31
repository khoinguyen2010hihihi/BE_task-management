import { WorkspaceRolePermissionMap, BoardRolePermissionMap } from './../authorization/roles/role-permissions.map';
import { Permissions } from "../authorization/permissions/permissions.constant";
import { RoleScope, WorkspaceMemberRole, BoardMemberRole } from "@/common/entities/enums";


export function hasPermission(
  scope: RoleScope,
  role: WorkspaceMemberRole | BoardMemberRole,
  permission: Permissions
): boolean {
  if (scope === RoleScope.WORKSPACE) {
    const permissions: Permissions[] = WorkspaceRolePermissionMap[role as WorkspaceMemberRole] || [];
    return permissions.includes(permission);
  }

  if (scope === RoleScope.BOARD) {
    const permissions: Permissions[] = BoardRolePermissionMap[role as BoardMemberRole] || [];
    return permissions.includes(permission);
  }

  return false;
}