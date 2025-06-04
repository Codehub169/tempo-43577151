import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsPositive, ValidateIf } from 'class-validator';

export class ConvertLeadDto {
  @ApiProperty({ example: 'New Project for Acme Corp', description: 'Name for the new Opportunity to be created' })
  @IsString({ message: 'Opportunity name must be a string.' })
  @IsNotEmpty({ message: 'Opportunity name is required.' })
  opportunityName: string;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Whether to create a new Account from Lead details. Defaults to true. If false, accountId must be provided.',
    default: true 
  })
  @IsOptional()
  @IsBoolean({ message: 'Create account flag must be a boolean.' })
  createAccount?: boolean = true;

  @ApiPropertyOptional({ example: 1, description: 'ID of an existing Account to link the Opportunity to. Required if createAccount is false.' })
  @ValidateIf(o => o.createAccount === false)
  @IsNotEmpty({ message: 'Account ID is required when not creating a new account.' })
  @IsNumber({}, { message: 'Account ID must be a number.' })
  @IsPositive({ message: 'Account ID must be a positive number.' })
  accountId?: number;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Whether to create a new Contact from Lead details. Defaults to true. If false, contactId must be provided.',
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'Create contact flag must be a boolean.' })
  createContact?: boolean = true;

  @ApiPropertyOptional({ example: 1, description: 'ID of an existing Contact to link the Opportunity to. Required if createContact is false.' })
  @ValidateIf(o => o.createContact === false)
  @IsNotEmpty({ message: 'Contact ID is required when not creating a new contact.' })
  @IsNumber({}, { message: 'Contact ID must be a number.' })
  @IsPositive({ message: 'Contact ID must be a positive number.' })
  contactId?: number;

  // Optional: You might want to allow overriding opportunity stage, value, etc. during conversion
  @ApiPropertyOptional({ example: 'Qualification', description: 'Initial stage for the new opportunity' })
  @IsOptional()
  @IsString()
  opportunityStage?: string; // Assuming stage is a string for now, could be an enum

  @ApiPropertyOptional({ example: 50000, description: 'Value for the new opportunity' })
  @IsOptional()
  @IsNumber({}, { message: 'Opportunity value must be a number.' })
  @IsPositive({ message: 'Opportunity value must be a positive number.' })
  opportunityValue?: number;
}
