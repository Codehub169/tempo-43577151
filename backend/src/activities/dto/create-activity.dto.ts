import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty, IsOptional, IsDateString, IsInt, Min, MaxLength, ValidateNested, IsUUID, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityType } from '../entities/activity.entity';

export enum RelatedEntityType {
  LEAD = 'Lead',
  OPPORTUNITY = 'Opportunity',
  ACCOUNT = 'Account',
  CONTACT = 'Contact',
  PROJECT = 'Project',
  TICKET = 'Ticket',
}

export class RelatedEntityDto {
  @ApiProperty({ enum: RelatedEntityType, description: 'Type of the entity this activity is related to.', example: RelatedEntityType.LEAD })
  @IsEnum(RelatedEntityType, { message: 'Invalid related entity type.' })
  @IsNotEmpty({ message: 'Related entity type must be provided.' })
  entityType: RelatedEntityType;

  @ApiProperty({ description: 'UUID of the related entity.', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @IsUUID('4', { message: 'Related entity ID must be a valid UUID.' })
  @IsNotEmpty({ message: 'Related entity ID must be provided.' })
  entityId: string;
}

export class CreateActivityDto {
  @ApiProperty({ enum: ActivityType, description: 'Type of the activity', example: ActivityType.CALL })
  @IsEnum(ActivityType, { message: 'Invalid activity type.' })
  @IsNotEmpty({ message: 'Activity type must be provided.' })
  type: ActivityType;

  @ApiPropertyOptional({ description: 'Subject or title of the activity', example: 'Follow-up call', maxLength: 255 })
  @IsOptional()
  @IsString({ message: 'Subject must be a string.' })
  @MaxLength(255, { message: 'Subject cannot exceed 255 characters.' })
  subject?: string;

  @ApiProperty({ description: 'Detailed notes or body of the activity', example: 'Discussed pricing and next steps.' })
  @IsString({ message: 'Body must be a string.' })
  @IsNotEmpty({ message: 'Body must not be empty.' })
  body: string;

  @ApiPropertyOptional({ description: 'Timestamp of when the activity occurred or is scheduled (ISO 8601 format)', example: '2023-10-26T10:00:00.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'Occurred At must be a valid ISO 8601 date string.' })
  occurredAt?: Date;

  @ApiPropertyOptional({ description: 'Duration of the activity in minutes (for calls/meetings)', example: 30 })
  @IsOptional()
  @IsInt({ message: 'Duration must be an integer.' })
  @Min(1, { message: 'Duration must be at least 1 minute.' })
  durationMinutes?: number;

  @ApiPropertyOptional({ description: 'Outcome of the activity', example: 'Agreed on next steps', maxLength: 500 })
  @IsOptional()
  @IsString({ message: 'Outcome must be a string.' })
  @MaxLength(500, { message: 'Outcome cannot exceed 500 characters.' })
  outcome?: string;

  @ApiPropertyOptional({ description: 'ID of the user to whom the activity (e.g., task) is assigned', example: 2 })
  @IsOptional()
  @IsInt({ message: 'Assigned user ID must be an integer.' })
  @Min(1, { message: 'Assigned user ID must be a positive integer.' })
  assignedToId?: number;

  @ApiProperty({ description: 'Information about the entity this activity is related to.' })
  @IsDefined({ message: 'Related entity information must be provided.' })
  @ValidateNested()
  @Type(() => RelatedEntityDto)
  relatedTo: RelatedEntityDto;
}
