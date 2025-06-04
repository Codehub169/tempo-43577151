import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  PROPOSAL_SENT = 'Proposal Sent',
  NEGOTIATION = 'Negotiation',
  LOST = 'Lost',
  UNQUALIFIED = 'Unqualified',
}

export enum LeadSource {
  WEBSITE = 'Website',
  REFERRAL = 'Referral',
  COLD_CALL = 'Cold Call',
  EMAIL_CAMPAIGN = 'Email Campaign',
  SOCIAL_MEDIA = 'Social Media',
  PAID_AD = 'Paid Ad',
  EVENT = 'Event',
  OTHER = 'Other',
}

@Entity('leads')
export class Lead {
  @ApiProperty({ example: 1, description: 'The unique identifier of the lead' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John', description: 'First name of the lead' })
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the lead' })
  @Column({ length: 100 })
  lastName: string;

  @ApiProperty({ example: 'Acme Corp', description: 'Company the lead works for', nullable: true })
  @Column({ length: 255, nullable: true })
  company?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the lead' })
  @Column({ length: 255, unique: true })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the lead', nullable: true })
  @Column({ length: 50, nullable: true })
  phone?: string;

  @ApiProperty({ enum: LeadStatus, example: LeadStatus.NEW, description: 'Status of the lead' })
  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @ApiProperty({ enum: LeadSource, example: LeadSource.WEBSITE, description: 'Source of the lead', nullable: true })
  @Column({
    type: 'enum',
    enum: LeadSource,
    nullable: true,
  })
  source?: LeadSource;

  @ApiProperty({ example: 'Interested in web development services.', description: 'Additional notes about the lead', nullable: true })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ example: 50000, description: 'Estimated value of the potential deal', nullable: true, type: 'decimal', precision: 12, scale: 2 })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  estimatedValue?: number;

  @ApiProperty({ type: () => User, description: 'User who created this lead', nullable: true })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy?: User;

  @Column({ nullable: true })
  createdById?: number;

  @ApiProperty({ type: () => User, description: 'User this lead is assigned to', nullable: true })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @Column({ nullable: true })
  assignedToId?: number;

  @ApiProperty({ description: 'Date and time when the lead was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the lead was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
