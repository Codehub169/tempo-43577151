import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Lead } from '../../leads/entities/lead.entity';
import { Opportunity } from '../../opportunities/entities/opportunity.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Contact } from '../../contacts/entities/contact.entity';
import { Project } from '../../projects/entities/project.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

export enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  TASK = 'TASK',
  NOTE = 'NOTE',
}

@Entity('activities')
export class Activity {
  @ApiProperty({ description: 'Unique identifier for the activity', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: ActivityType, description: 'Type of the activity', example: ActivityType.CALL })
  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @ApiProperty({ description: 'Subject or title of the activity', example: 'Follow-up call regarding proposal', required: false })
  @Column({ length: 255, nullable: true })
  subject?: string;

  @ApiProperty({ description: 'Detailed notes or body of the activity', example: 'Discussed pricing and next steps.' })
  @Column('text')
  body: string;

  @ApiProperty({ description: 'Timestamp of when the activity occurred or is scheduled', example: '2023-10-26T10:00:00.000Z' })
  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  occurredAt: Date;

  @ApiProperty({ description: 'Duration of the activity in minutes (for calls/meetings)', example: 30, required: false })
  @Column({ type: 'integer', nullable: true })
  durationMinutes?: number;

  @ApiProperty({ description: 'Outcome of the activity (e.g., for calls/meetings)', example: 'Agreed on next steps', required: false })
  @Column({ length: 500, nullable: true })
  outcome?: string;

  // Relations to User (Creator and Assignee)
  @ApiProperty({ type: () => User, description: 'User who created the activity' })
  @ManyToOne(() => User, { nullable: false, onDelete: 'SET NULL' }) // Cannot be nullable false if onDelete is SET NULL, should be nullable: true or creator mandatory
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ApiProperty({ description: 'ID of the user who created the activity', example: 1 })
  @Column()
  @Index()
  createdById: number;

  @ApiProperty({ type: () => User, description: 'User to whom the activity (e.g., task) is assigned', required: false })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @ApiProperty({ description: 'ID of the user to whom the activity is assigned', example: 2, required: false })
  @Column({ nullable: true })
  @Index()
  assignedToId?: number;

  // Polymorphic-like relations to other entities
  @ApiProperty({ type: () => Lead, description: 'Related lead, if any', required: false })
  @ManyToOne(() => Lead, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'relatedLeadId' })
  relatedLead?: Lead;

  @ApiProperty({ description: 'ID of the related lead', example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', required: false })
  @Column({ type: 'uuid', nullable: true })
  @Index()
  relatedLeadId?: string;

  @ApiProperty({ type: () => Opportunity, description: 'Related opportunity, if any', required: false })
  @ManyToOne(() => Opportunity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'relatedOpportunityId' })
  relatedOpportunity?: Opportunity;

  @ApiProperty({ description: 'ID of the related opportunity', example: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', required: false })
  @Column({ type: 'uuid', nullable: true })
  @Index()
  relatedOpportunityId?: string;

  @ApiProperty({ type: () => Account, description: 'Related account, if any', required: false })
  @ManyToOne(() => Account, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'relatedAccountId' })
  relatedAccount?: Account;

  @ApiProperty({ description: 'ID of the related account', example: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', required: false })
  @Column({ type: 'uuid', nullable: true })
  @Index()
  relatedAccountId?: string;

  @ApiProperty({ type: () => Contact, description: 'Related contact, if any', required: false })
  @ManyToOne(() => Contact, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'relatedContactId' })
  relatedContact?: Contact;

  @ApiProperty({ description: 'ID of the related contact', example: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', required: false })
  @Column({ type: 'uuid', nullable: true })
  @Index()
  relatedContactId?: string;

  @ApiProperty({ type: () => Project, description: 'Related project, if any', required: false })
  @ManyToOne(() => Project, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'relatedProjectId' })
  relatedProject?: Project;

  @ApiProperty({ description: 'ID of the related project', example: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', required: false })
  @Column({ type: 'uuid', nullable: true })
  @Index()
  relatedProjectId?: string;

  @ApiProperty({ type: () => Ticket, description: 'Related ticket, if any', required: false })
  @ManyToOne(() => Ticket, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'relatedTicketId' })
  relatedTicket?: Ticket;

  @ApiProperty({ description: 'ID of the related ticket', example: 'g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', required: false })
  @Column({ type: 'uuid', nullable: true })
  @Index()
  relatedTicketId?: string;

  @ApiProperty({ description: 'Timestamp of activity creation' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of last activity update' })
  @UpdateDateColumn()
  updatedAt: Date;
}
