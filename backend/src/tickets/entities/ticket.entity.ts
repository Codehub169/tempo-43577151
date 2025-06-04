import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Project } from '../../projects/entities/project.entity';
// import { TicketComment } from './ticket-comment.entity'; // To be implemented in a later batch

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity('tickets')
export class Ticket {
  @ApiProperty({ description: 'Unique identifier for the ticket', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the ticket', example: 'Login Issue' })
  @Column({ length: 255 })
  title: string;

  @ApiProperty({ description: 'Detailed description of the issue' })
  @Column('text')
  description: string;

  @ApiProperty({ enum: TicketStatus, description: 'Current status of the ticket', example: TicketStatus.OPEN, default: TicketStatus.OPEN })
  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @ApiProperty({ enum: TicketPriority, description: 'Priority level of the ticket', example: TicketPriority.MEDIUM, default: TicketPriority.MEDIUM })
  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @ApiPropertyOptional({ type: () => Account, description: 'Account associated with this ticket' })
  @ManyToOne(() => Account, (account) => account.tickets, { nullable: true, onDelete: 'CASCADE' }) // Cascade delete based on Account entity spec
  @JoinColumn({ name: 'accountId' })
  account?: Account;

  @ApiPropertyOptional({ description: 'ID of the account associated with this ticket', example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @Column({ type: 'uuid', nullable: true })
  accountId?: string;

  @ApiPropertyOptional({ type: () => Project, description: 'Project associated with this ticket' })
  @ManyToOne(() => Project, (project) => project.tickets, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'projectId' })
  project?: Project;

  @ApiPropertyOptional({ description: 'ID of the project associated with this ticket', example: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' })
  @Column({ type: 'uuid', nullable: true })
  projectId?: string;

  @ApiProperty({ type: () => User, description: 'User who created this ticket' })
  @ManyToOne(() => User, { nullable: false, onDelete: 'SET NULL' }) // Creator should exist, but if deleted, set ticket creator to null
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ApiProperty({ description: 'ID of the user who created this ticket', example: 1 })
  @Column()
  createdById: number;

  @ApiPropertyOptional({ type: () => User, description: 'User assigned to this ticket' })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @ApiPropertyOptional({ description: 'ID of the user assigned to this ticket', example: 2 })
  @Column({ nullable: true })
  assignedToId?: number;

  // @OneToMany(() => TicketComment, (comment) => comment.ticket) // To be implemented in a later batch
  // comments: TicketComment[];

  @ApiProperty({ description: 'Date and time when the ticket was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the ticket was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Date and time when the ticket was soft-deleted' })
  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;
}
