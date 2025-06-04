import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
  MaxLength,
  IsEnum,
  MinLength,
  IsPositive,
  Max,
  IsDecimal
} from 'class-validator';
import { OpportunityStage } from '../entities/opportunity.entity';

export class CreateOpportunityDto {
  @ApiProperty({
    description: 'Name of the opportunity',
    example: 'New Website Development for Client X',
    maxLength: 255,
  })
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  @MinLength(3, { message: 'Name must be at least 3 characters long.' })
  @MaxLength(255, { message: 'Name cannot exceed 255 characters.' })
  name: string;

  @ApiPropertyOptional({
    description: 'ID of the associated account',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Account ID must be a number.' })
  @IsPositive({ message: 'Account ID must be a positive number.' })
  accountId?: number;

  @ApiPropertyOptional({
    description: 'ID of the associated contact',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Contact ID must be a number.' })
  @IsPositive({ message: 'Contact ID must be a positive number.' })
  contactId?: number;

  @ApiProperty({
    description: 'Current stage of the opportunity',
    enum: OpportunityStage,
    default: OpportunityStage.PROSPECTING,
    example: OpportunityStage.PROSPECTING,
  })
  @IsNotEmpty({ message: 'Stage is required.' })
  @IsEnum(OpportunityStage, { message: 'Invalid opportunity stage.' })
  stage: OpportunityStage = OpportunityStage.PROSPECTING;

  @ApiPropertyOptional({
    description: 'Estimated value of the opportunity',
    example: 50000.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Value must be a number with up to 2 decimal places.' })
  @Min(0, { message: 'Value cannot be negative.' })
  @IsDecimal({ decimal_digits: '0,2' }, { message: 'Value must be a decimal with up to 2 decimal places.'})
  value?: number;

  @ApiPropertyOptional({
    description: 'Expected close date of the opportunity (ISO 8601 format)',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Expected close date must be a valid ISO 8601 date string.' })
  expectedCloseDate?: Date;

  @ApiPropertyOptional({
    description: 'Detailed description of the opportunity',
    example: 'Client X requires a new corporate website with e-commerce functionality.',
    maxLength: 2000
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(2000, { message: 'Description cannot exceed 2000 characters.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the user this opportunity is assigned to',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Assigned user ID must be a number.' })
  @IsPositive({ message: 'Assigned user ID must be a positive number.' })
  assignedToId?: number;
}
