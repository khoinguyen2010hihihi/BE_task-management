import { DateTimeEntity } from './base/dateTimeEntity';
import {
  Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany,
} from 'typeorm';
import { RoleScope } from './enums';
import { RolePermission } from './role-permission.entity';

@Entity('roles')
@Unique(['scope', 'name'])
export class Role extends DateTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: RoleScope })
  scope!: RoleScope;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @OneToMany(() => RolePermission, (rp) => rp.role)
  rolePermissions!: RolePermission[];
}
