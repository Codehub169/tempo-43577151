import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Contact } from '../../contacts/entities/contact.entity';

export enum OpportunityStage {
  PROSPECTING = 'Prospecting',
  QUALIFICATION = 'Qualification',
  NEEDS_ANALYSIS = 'Needs Analysis',
  VALUE_PROPOSITION = 'Value Proposition',
  PROPOSAL_SENT = 'Proposal/Price Quote Sent',
  NEGOTIATION = 'Negotiation/Review',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost',
}

@Entity('opportunities')
export class Opportunity {
  @ApiProperty({ description: 'The unique identifier for the opportunity.', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the opportunity.', example: 'New Website Development' })
  @Column({ length: 255 })
  name: string;

  @ApiPropertyOptional({ description: 'The ID of the account associated with this opportunity.', example: 12 })
  @Column({ nullable: true })
  accountId?: number;

  @ManyToOne(() => Account, (account) => account.opportunities, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'accountId' })
  account?: Account;

  @ApiPropertyOptional({ description: 'The ID of the primary contact for this opportunity.', example: 5 })
  @Column({ nullable: true })
  contactId?: number;

  @ManyToOne(() => Contact, (contact) => contact.opportunities, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'contactId' })
  contact?: Contact;

  @ApiProperty({ description: 'The current stage of the opportunity.', enum: OpportunityStage, example: OpportunityStage.PROSPECTING })
  @Column({
    type: 'enum',
    enum: OpportunityStage,
    default: OpportunityStage.PROSPECTING,
  })
  stage: OpportunityStage;

  @ApiPropertyOptional({ description: 'The estimated value of the opportunity.', example: 50000 })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  value?: number;

  @ApiPropertyOptional({ description: 'The expected close date for the opportunity.', example: '2024-12-31' })
  @Column({ type: 'date', nullable: true })
  expectedCloseDate?: Date;

  @ApiPropertyOptional({ description: 'A short description or notes about the opportunity.' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiPropertyOptional({ description: 'Reason if the opportunity was lost.' })
  @Column({ type: 'text', nullable: true })
  lostReason?: string;

  @ApiPropertyOptional({ description: 'The ID of the user who created this opportunity.' })
  @Column({ nullable: true })
  createdById?: number;

  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy?: User;

  @ApiPropertyOptional({ description: 'The ID of the user this opportunity is assigned to.' })
  @Column({ nullable: true })
  assignedToId?: number;

  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @ApiProperty({ description: 'The date and time the opportunity was created.' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date and time the opportunity was last updated.' })
  @UpdateDateColumn()
  updatedAt: Date;
}
