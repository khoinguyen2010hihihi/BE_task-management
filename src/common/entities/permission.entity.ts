import { DateTimeEntity } from './base/dateTimeEntity';
import {
  Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany,
} from 'typeorm';
import { PermissionResource } from './enums';
import { RolePermission } from './role-permission.entity';

@Entity('permissions')
@Unique(['resource', 'action'])
export class Permission extends DateTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: PermissionResource })
  resource!: PermissionResource;

  @Column({ type: 'varchar' })
  action!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions!: RolePermission[];
}
