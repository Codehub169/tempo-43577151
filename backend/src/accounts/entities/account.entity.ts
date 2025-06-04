import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Contact } from '../../contacts/entities/contact.entity';
import { Opportunity } from '../../opportunities/entities/opportunity.entity';
import { Project } from '../../projects/entities/project.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('accounts')
export class Account {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The unique identifier of the account' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Acme Corporation', description: 'The name of the account' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ example: 'Technology', description: 'Industry the account belongs to', required: false })
  @Column({ length: 100, nullable: true })
  industry?: string;

  @ApiProperty({ example: 'https://acme.corp', description: 'Website of the account', required: false })
  @Column({ length: 255, nullable: true })
  website?: string;

  @ApiProperty({ example: '+1-555-123-4567', description: 'Primary phone number for the account', required: false })
  @Column({ length: 50, nullable: true })
  phone?: string;

  @ApiProperty({ example: '123 Main St', description: 'Billing address street', required: false })
  @Column({ name: 'billing_address_street', length: 255, nullable: true })
  billingAddressStreet?: string;

  @ApiProperty({ example: 'Anytown', description: 'Billing address city', required: false })
  @Column({ name: 'billing_address_city', length: 100, nullable: true })
  billingAddressCity?: string;

  @ApiProperty({ example: 'CA', description: 'Billing address state/province', required: false })
  @Column({ name: 'billing_address_state', length: 100, nullable: true })
  billingAddressState?: string;

  @ApiProperty({ example: '90210', description: 'Billing address postal code', required: false })
  @Column({ name: 'billing_address_postal_code', length: 20, nullable: true })
  billingAddressPostalCode?: string;

  @ApiProperty({ example: 'USA', description: 'Billing address country', required: false })
  @Column({ name: 'billing_address_country', length: 100, nullable: true })
  billingAddressCountry?: string;

  @ApiProperty({ example: '456 Oak Ave', description: 'Shipping address street', required: false })
  @Column({ name: 'shipping_address_street', length: 255, nullable: true })
  shippingAddressStreet?: string;

  @ApiProperty({ example: 'Otherville', description: 'Shipping address city', required: false })
  @Column({ name: 'shipping_address_city', length: 100, nullable: true })
  shippingAddressCity?: string;

  @ApiProperty({ example: 'NY', description: 'Shipping address state/province', required: false })
  @Column({ name: 'shipping_address_state', length: 100, nullable: true })
  shippingAddressState?: string;

  @ApiProperty({ example: '10001', description: 'Shipping address postal code', required: false })
  @Column({ name: 'shipping_address_postal_code', length: 20, nullable: true })
  shippingAddressPostalCode?: string;

  @ApiProperty({ example: 'USA', description: 'Shipping address country', required: false })
  @Column({ name: 'shipping_address_country', length: 100, nullable: true })
  shippingAddressCountry?: string;

  @ApiProperty({ description: 'General notes or description about the account', required: false })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ type: () => User, description: 'The user who created the account', required: false })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: User;

  @Column({ name: 'created_by_id', nullable: true })
  createdById?: number; 

  @ApiProperty({ type: () => User, description: 'The user assigned to manage the account', required: false })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo?: User;

  @Column({ name: 'assigned_to_id', nullable: true })
  assignedToId?: number;

  @ApiProperty({ type: () => [Contact], description: 'Contacts associated with this account', required: false })
  @OneToMany(() => Contact, contact => contact.account, { cascade: true, nullable: true })
  contacts?: Contact[];

  @ApiProperty({ type: () => [Opportunity], description: 'Opportunities associated with this account', required: false })
  @OneToMany(() => Opportunity, opportunity => opportunity.account, { nullable: true, onDelete: 'SET NULL' })
  opportunities?: Opportunity[];

  @ApiProperty({ type: () => [Project], description: 'Projects associated with this account', required: false })
  @OneToMany(() => Project, project => project.account, { nullable: true, onDelete: 'SET NULL' })
  projects?: Project[];

  @ApiProperty({ type: () => [Ticket], description: 'Support tickets associated with this account', required: false })
  @OneToMany(() => Ticket, ticket => ticket.account, { cascade: true, nullable: true })
  tickets?: Ticket[];

  @ApiProperty({ description: 'The date and time the account was created' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty({ description: 'The date and time the account was last updated' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
