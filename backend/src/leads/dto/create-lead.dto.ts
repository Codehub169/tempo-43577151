import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsNumber, Min, MaxLength, IsPositive } from 'class-validator';
import { LeadStatus, LeadSource } from '../entities/lead.entity';

export class CreateLeadDto {
  @ApiProperty({ example: 'John', description: 'First name of the lead', maxLength: 100 })
  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name is required.' })
  @MaxLength(100, { message: 'First name must be 100 characters or less.' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the lead', maxLength: 100 })
  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  @MaxLength(100, { message: 'Last name must be 100 characters or less.' })
  lastName: string;

  @ApiPropertyOptional({ example: 'Acme Corp', description: 'Company the lead works for', maxLength: 255 })
  @IsOptional()
  @IsString({ message: 'Company name must be a string.' })
  @MaxLength(255, { message: 'Company name must be 255 characters or less.' })
  company?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the lead' })
  @IsEmail({}, { message: 'A valid email address is required.' })
  @IsNotEmpty({ message: 'Email is required.' })
  @MaxLength(255, { message: 'Email must be 255 characters or less.' })
  email: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number of the lead', maxLength: 50 })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string.' })
  @MaxLength(50, { message: 'Phone number must be 50 characters or less.' })
  phone?: string;

  @ApiPropertyOptional({ enum: LeadStatus, example: LeadStatus.NEW, description: 'Status of the lead' })
  @IsOptional()
  @IsEnum(LeadStatus, { message: 'Invalid lead status provided.' })
  status?: LeadStatus;

  @ApiPropertyOptional({ enum: LeadSource, example: LeadSource.WEBSITE, description: 'Source of the lead' })
  @IsOptional()
  @IsEnum(LeadSource, { message: 'Invalid lead source provided.' })
  source?: LeadSource;

  @ApiPropertyOptional({ example: 'Interested in web development services.', description: 'Additional notes about the lead' })
  @IsOptional()
  @IsString({ message: 'Notes must be a string.' })
  notes?: string;

  @ApiPropertyOptional({ example: 50000, description: 'Estimated value of the potential deal', type: 'number' })
  @IsOptional()
  @IsNumber({}, { message: 'Estimated value must be a number.' })
  @IsPositive({ message: 'Estimated value must be a positive number.' })
  @Min(0, { message: 'Estimated value cannot be negative.' })
  estimatedValue?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID of the user this lead is assigned to' })
  @IsOptional()
  @IsNumber({}, { message: 'Assigned user ID must be a number.' })
  @IsPositive({ message: 'Assigned user ID must be a positive number.' })
  assignedToId?: number;
}
