import { DateTimeEntity } from './base/dateTimeEntity';
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Unique, Index,
} from 'typeorm';
import { Board } from './board.entity';
import { Card } from './card.entity';

@Entity('lists')
@Unique(['board', 'position'])
export class List extends DateTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Board, (b) => b.lists, { onDelete: 'CASCADE', nullable: false })
  @Index()
  board!: Board;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 3 })
  position!: string; // TypeORM map NUMERIC -> string; khi tính toán hãy cast số

  @Column({ type: 'boolean', default: false, name: 'is_closed' })
  isClosed!: boolean;

  @OneToMany(() => Card, (c) => c.list)
  cards!: Card[];
}
