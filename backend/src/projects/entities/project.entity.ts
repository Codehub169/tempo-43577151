import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';

export enum ProjectStatus {
  NOT_STARTED = 'Not Started',
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

@Entity('projects')
export class Project {
  @ApiProperty({ description: 'Unique identifier for the project', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the project', example: 'CRM Implementation Phase 1' })
  @Column({ length: 255 })
  @Index()
  name: string;

  @ApiPropertyOptional({ description: 'Detailed description of the project', example: 'Initial phase of CRM implementation focusing on core sales module.' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ enum: ProjectStatus, description: 'Current status of the project', example: ProjectStatus.IN_PROGRESS, default: ProjectStatus.NOT_STARTED })
  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.NOT_STARTED,
  })
  status: ProjectStatus;

  @ApiPropertyOptional({ description: 'Planned or actual start date of the project', example: '2024-01-15', type: 'string', format: 'date' })
  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Planned or actual end date of the project', example: '2024-06-30', type: 'string', format: 'date' })
  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Budget allocated for the project', example: 50000.00, type: 'number', format: 'float' })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget?: number;

  @ApiProperty({ description: 'Account/Client for which the project is being done' })
  @ManyToOne(() => Account, (account) => account.projects, { onDelete: 'SET NULL', nullable: false }) // A project must be linked to an account
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ApiProperty({ description: 'ID of the account/client', example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' })
  @Column()
  accountId: string;

  @ApiPropertyOptional({ description: 'User who is managing the project' })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' }) // Project manager can be optional or unassigned
  @JoinColumn({ name: 'projectManagerId' })
  projectManager?: User;

  @ApiPropertyOptional({ description: 'ID of the user managing the project', example: 1 })
  @Column({ nullable: true })
  projectManagerId?: number;

  @ApiProperty({ description: 'User who created the project record' })
  @ManyToOne(() => User, { nullable: false, onDelete: 'SET NULL' }) // Creator must exist, if user deleted, set to null
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ApiProperty({ description: 'ID of the user who created the project record', example: 2 })
  @Column()
  createdById: number;

  @ApiPropertyOptional({ description: 'Team members assigned to the project', type: () => [User] })
  @ManyToMany(() => User)
  @JoinTable({
    name: 'project_team_members',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  teamMembers?: User[];

  @ApiProperty({ description: 'Timestamp of when the project was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of when the project was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
