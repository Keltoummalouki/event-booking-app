import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELED = 'CANCELED',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  date: Date;

  @Column()
  location: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  @CreateDateColumn()
  createdAt: Date;

  // Relation avec l'Admin qui crée l'événement
  @ManyToOne(() => User, { eager: false })
  organizer: User;
}