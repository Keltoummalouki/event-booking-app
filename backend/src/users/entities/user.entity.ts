import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  PARTICIPANT = 'PARTICIPANT',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Ne jamais retourner le hash par défaut
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PARTICIPANT })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}