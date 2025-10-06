import { DateTimeEntity } from './base/dateTimeEntity';
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, Unique,
} from 'typeorm';
import { List } from './list.entity';
import { User } from './user.entity';

@Entity('cards')
@Unique(['list', 'position'])
export class Card extends DateTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => List, (l) => l.cards, { onDelete: 'CASCADE', nullable: false })
  @Index()
  list!: List;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 3 })
  position!: string; // NUMERIC -> string

  @Column({ type: 'timestamptz', nullable: true, name: 'due_at' })
  dueAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'start_at' })
  startAt!: Date | null;

  @Column({ type: 'varchar', nullable: true, name: 'cover_url' })
  coverUrl!: string | null;

  @Column({ type: 'boolean', default: false, name: 'is_archived' })
  isArchived!: boolean;

  @ManyToOne(() => User, (u) => u.createdCards, { onDelete: 'SET NULL', nullable: true })
  @Index()
  createdBy!: User | null;
}
