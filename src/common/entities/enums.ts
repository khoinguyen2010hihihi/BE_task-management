export enum Visibility {
  PRIVATE = 'private',
  WORKSPACE = 'workspace',
  PUBLIC = 'public',
}

export enum RoleScope {
  WORKSPACE = 'workspace',
  BOARD = 'board',
}

export enum PermissionResource {
  WORKSPACE = 'workspace',
  BOARD = 'board',
  LIST = 'list',
  CARD = 'card',
  COMMENT = 'comment',
  MEMBER = 'member',
}

export enum WorkspaceMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

export enum BoardMemberRole {
  ADMIN = 'admin',
  NORMAL = 'normal',
  OBSERVER = 'observer',
}