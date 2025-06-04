import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsNumber, Min, IsUUID, IsArray, ArrayNotEmpty, IsInt, MaxLength } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({ description: 'Name of the project', example: 'CRM Implementation Phase 1', maxLength: 255 })
  @IsString({ message: 'Project name must be a string.' })
  @IsNotEmpty({ message: 'Project name is required.' })
  @MaxLength(255, { message: 'Project name must be 255 characters or less.' })
  name: string;

  @ApiPropertyOptional({ description: 'Detailed description of the project', example: 'Initial phase of CRM implementation.' })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiPropertyOptional({ enum: ProjectStatus, description: 'Current status of the project', default: ProjectStatus.NOT_STARTED, example: ProjectStatus.IN_PROGRESS })
  @IsOptional()
  @IsEnum(ProjectStatus, { message: `Status must be one of the following values: ${Object.values(ProjectStatus).join(', ')}` })
  status?: ProjectStatus = ProjectStatus.NOT_STARTED;

  @ApiPropertyOptional({ description: 'Planned or actual start date of the project (YYYY-MM-DD)', example: '2024-01-15', type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO 8601 date string.' })
  startDate?: string;

  @ApiPropertyOptional({ description: 'Planned or actual end date of the project (YYYY-MM-DD)', example: '2024-06-30', type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO 8601 date string.' })
  endDate?: string;

  @ApiPropertyOptional({ description: 'Budget allocated for the project', example: 50000.00, type: 'number', minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Budget must be a number with up to 2 decimal places.' })
  @Min(0, { message: 'Budget cannot be negative.' })
  @Transform(({ value }) => parseFloat(value) || null) // Ensure transformation for validation and type consistency
  budget?: number;

  @ApiProperty({ description: 'ID of the account/client for this project', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @IsUUID('4', { message: 'Account ID must be a valid UUID.' })
  @IsNotEmpty({ message: 'Account ID is required.' })
  accountId: string;

  @ApiPropertyOptional({ description: 'ID of the user designated as project manager', example: 1 })
  @IsOptional()
  @IsInt({ message: 'Project manager ID must be an integer.' })
  @Min(1, { message: 'Project manager ID must be a positive integer.' })
  projectManagerId?: number;

  @ApiPropertyOptional({ description: 'Array of user IDs for team members', example: [1, 2], type: [Number] })
  @IsOptional()
  @IsArray({ message: 'Team member IDs must be an array.' })
  @ArrayNotEmpty({ message: 'Team member IDs array cannot be empty if provided.' })
  @IsInt({ each: true, message: 'Each team member ID must be an integer.' })
  @Min(1, { each: true, message: 'Each team member ID must be a positive integer.' })
  teamMemberIds?: number[];
}
