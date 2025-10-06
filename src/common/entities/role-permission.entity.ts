import { DateTimeEntity } from './base/dateTimeEntity';
import {
  Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('role_permissions')
// PK composite: (role_id, permission_id)
export class RolePermission extends DateTimeEntity {
  @PrimaryColumn('uuid', { name: 'role_id' })
  roleId!: string;

  @PrimaryColumn('uuid', { name: 'permission_id' })
  permissionId!: string;

  @ManyToOne(() => Role, (r) => r.rolePermissions, { onDelete: 'CASCADE' })
  role!: Role;

  @ManyToOne(() => Permission, (p) => p.rolePermissions, { onDelete: 'CASCADE' })
  permission!: Permission;
}
