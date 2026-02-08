import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'PENDING' }) // PENDING, CONFIRMED, CANCELED
  status: string;

  @ManyToOne(() => User, (user) => user.bookings)
  participant: User;

  @ManyToOne(() => Event, (event) => event.bookings)
  event: Event;
}