import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    description: 'First name of the contact',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(100, { message: 'First name must be 100 characters or less' })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the contact',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(100, { message: 'Last name must be 100 characters or less' })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Email address of the contact',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email must be 255 characters or less' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the contact',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @MaxLength(50, { message: 'Phone number must be 50 characters or less' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Job title of the contact',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString({ message: 'Job title must be a string' })
  @MaxLength(100, { message: 'Job title must be 100 characters or less' })
  jobTitle?: string;

  @ApiPropertyOptional({
    description: 'Additional description or notes about the contact',
    example: 'Met at the tech conference.',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the account this contact is associated with',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Account ID must be a valid UUID' })
  accountId?: string;

  @ApiPropertyOptional({
    description: 'ID of the user this contact is assigned to',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Assigned to ID must be a number' })
  @IsPositive({ message: 'Assigned to ID must be a positive number' })
  assignedToId?: number;
}
