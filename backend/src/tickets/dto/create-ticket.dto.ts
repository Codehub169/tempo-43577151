import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEnum,
  IsUUID,
  IsInt,
  IsPositive,
  MinLength,
} from 'class-validator';
import { TicketStatus, TicketPriority } from '../entities/ticket.entity';

export class CreateTicketDto {
  @ApiProperty({
    description: 'The title of the ticket.',
    example: 'Login button not working on staging environment',
    minLength: 5,
    maxLength: 255,
  })
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  @MinLength(5, { message: 'Title must be at least 5 characters long.' })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters.' })
  title: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the issue or request.',
    example: 'When users click the login button, an error message appears and they cannot log in. This started after the last deployment.',
    type: 'string',
    format: 'text',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'The current status of the ticket.',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
    example: TicketStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(TicketStatus, { message: 'Invalid ticket status provided.' })
  status?: TicketStatus = TicketStatus.OPEN;

  @ApiPropertyOptional({
    description: 'The priority level of the ticket.',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
    example: TicketPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TicketPriority, { message: 'Invalid ticket priority provided.' })
  priority?: TicketPriority = TicketPriority.MEDIUM;

  @ApiPropertyOptional({
    description: 'The ID of the account this ticket is associated with (if any).',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Account ID must be a valid UUID.' })
  accountId?: string;

  @ApiPropertyOptional({
    description: 'The ID of the project this ticket is associated with (if any).',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Project ID must be a valid UUID.' })
  projectId?: string;

  @ApiPropertyOptional({
    description: 'The ID of the user this ticket is assigned to (if any).',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Assigned user ID must be an integer.' })
  @IsPositive({ message: 'Assigned user ID must be a positive number.' })
  assignedToId?: number;
}
