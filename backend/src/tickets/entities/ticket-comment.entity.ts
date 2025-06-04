import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('ticket_comments')
export class TicketComment {
  @ApiProperty({
    description: 'The unique identifier for the ticket comment.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The content of the comment.',
    example: 'Checked the logs, the issue seems to be related to the recent deployment.',
    type: 'string',
    format: 'text',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ type: () => Ticket, description: 'The ticket this comment belongs to.' })
  @ManyToOne(() => Ticket, (ticket) => ticket.comments, {
    nullable: false,
    onDelete: 'CASCADE', // If a ticket is deleted, its comments are also deleted
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ApiProperty({ description: 'The ID of the ticket this comment belongs to.', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @Column({ name: 'ticket_id' })
  ticketId: string;

  @ApiProperty({ type: () => User, description: 'The user who authored this comment.' })
  @ManyToOne(() => User, (user) => user.ticketComments, {
    nullable: false, // A comment must have an author
    onDelete: 'SET NULL', // If the author user is deleted, set author to null
  })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ApiProperty({ description: 'The ID of the user who authored this comment.', example: 1 })
  @Column({ name: 'author_id', nullable: true }) // Nullable if user is deleted
  authorId: number;

  @ApiProperty({
    description: 'The date and time when the comment was created.',
    example: '2023-01-01T12:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the comment was last updated.',
    example: '2023-01-01T13:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
