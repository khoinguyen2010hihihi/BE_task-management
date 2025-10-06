import { DateTimeEntity } from './base/dateTimeEntity';
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index,
} from 'typeorm';
import { Card } from './card.entity';
import { User } from './user.entity';

@Entity('comments')
export class Comment extends DateTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Card, { onDelete: 'CASCADE', nullable: false })
  @Index()
  card!: Card;

  @ManyToOne(() => User, (u) => u.comments, { onDelete: 'SET NULL', nullable: true })
  @Index()
  author!: User | null;

  @Column({ type: 'text' })
  content!: string;

  // self reference
  @ManyToOne(() => Comment, { onDelete: 'SET NULL', nullable: true })
  @Index()
  parent!: Comment | null; // DB column: comment_parent_id
}
