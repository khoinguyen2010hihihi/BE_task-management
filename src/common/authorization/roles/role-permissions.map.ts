import { Permissions } from "../permissions/permissions.constant"
import { BoardMemberRole, WorkspaceMemberRole } from "@/common/entities/enums";

export const WorkspaceRolePermissionMap = {
  [WorkspaceMemberRole.OWNER]: [
    Permissions.CREATE_WORKSPACE,
    Permissions.UPDATE_WORKSPACE,
    Permissions.DELETE_WORKSPACE,
    Permissions.ADD_WORKSPACE_MEMBER,
    Permissions.REMOVE_WORKSPACE_MEMBER,
    Permissions.CHANGE_WORKSPACE_ROLE,
    Permissions.CREATE_BOARD,
    Permissions.UPDATE_BOARD,
    Permissions.DELETE_BOARD,
    Permissions.ADD_BOARD_MEMBER,
    Permissions.REMOVE_BOARD_MEMBER,
    Permissions.CHANGE_BOARD_ROLE,
  ],

  [WorkspaceMemberRole.ADMIN]: [
    Permissions.UPDATE_WORKSPACE,
    Permissions.ADD_WORKSPACE_MEMBER,
    Permissions.REMOVE_WORKSPACE_MEMBER,
    Permissions.CREATE_BOARD,
    Permissions.UPDATE_BOARD,
    Permissions.DELETE_BOARD,
  ],

  [WorkspaceMemberRole.MEMBER]: [

  ],

  [WorkspaceMemberRole.GUEST]: [],
};

export const BoardRolePermissionMap = {
  [BoardMemberRole.OWNER]: [
    Permissions.CREATE_BOARD,
    Permissions.UPDATE_BOARD,
    Permissions.DELETE_BOARD,
    Permissions.ADD_BOARD_MEMBER,
    Permissions.REMOVE_BOARD_MEMBER,
    Permissions.CHANGE_BOARD_ROLE,
  ],

  [BoardMemberRole.ADMIN]: [
    Permissions.UPDATE_BOARD,
    Permissions.ADD_BOARD_MEMBER,
  ],

  [BoardMemberRole.NORMAL]: [
  ],

  [BoardMemberRole.OBSERVER]: [],
};
