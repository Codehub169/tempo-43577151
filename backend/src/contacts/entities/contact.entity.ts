import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, DeleteDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Account } from '../../accounts/entities/account.entity';
import { User } from '../../users/entities/user.entity';
import { Opportunity } from '../../opportunities/entities/opportunity.entity';

@Entity('contacts')
@Index(['email', 'accountId'], { unique: true, where: '"email" IS NOT NULL AND "accountId" IS NOT NULL' })
export class Contact {
  @ApiProperty({ description: 'Unique identifier for the contact', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'First name of the contact', example: 'John' })
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty({ description: 'Last name of the contact', example: 'Doe' })
  @Column({ length: 100 })
  lastName: string;

  @ApiPropertyOptional({ description: 'Email address of the contact', example: 'john.doe@example.com' })
  @Column({ length: 255, nullable: true })
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number of the contact', example: '+1-555-123-4567' })
  @Column({ length: 50, nullable: true })
  phone?: string;

  @ApiPropertyOptional({ description: 'Job title of the contact', example: 'Sales Manager' })
  @Column({ length: 100, nullable: true })
  jobTitle?: string;

  @ApiPropertyOptional({ description: 'Additional notes or description for the contact' })
  @Column('text', { nullable: true })
  description?: string;

  @ApiPropertyOptional({ type: () => Account, description: 'The account this contact is associated with' })
  @ManyToOne(() => Account, (account) => account.contacts, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'accountId' })
  account?: Account;

  @ApiPropertyOptional({ description: 'ID of the account this contact is associated with', example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @Column({ type: 'uuid', nullable: true })
  accountId?: string;

  @ApiPropertyOptional({ type: () => User, description: 'The user who created this contact' })
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy?: User;

  @ApiPropertyOptional({ description: 'ID of the user who created this contact', example: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' })
  @Column({ type: 'uuid', nullable: true })
  createdById?: string;

  @ApiPropertyOptional({ type: () => User, description: 'The user this contact is assigned to' })
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @ApiPropertyOptional({ description: 'ID of the user this contact is assigned to', example: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' })
  @Column({ type: 'uuid', nullable: true })
  assignedToId?: string;
  
  @ApiPropertyOptional({ type: () => [Opportunity], description: 'Opportunities associated with this contact' })
  @OneToMany(() => Opportunity, (opportunity) => opportunity.contact, { nullable: true, cascade: ['soft-remove', 'recover'] })
  opportunities?: Opportunity[];

  @ApiProperty({ description: 'Date and time when the contact was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the contact was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date; // For soft delete
}
