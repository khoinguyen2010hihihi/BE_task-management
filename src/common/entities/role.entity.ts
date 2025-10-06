import { DateTimeEntity } from './base/dateTimeEntity';
import {
  Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany,
  ManyToMany,
} from 'typeorm';
import { RoleScope } from './enums';
import { RolePermission } from './role-permission.entity';
import { User } from './user.entity';

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

  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];
}
