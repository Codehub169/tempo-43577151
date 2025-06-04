import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl, Length, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: 'Acme Corporation', description: 'Name of the account (company)', maxLength: 255 })
  @IsString({ message: 'Account name must be a string.' })
  @IsNotEmpty({ message: 'Account name is required.' })
  @MaxLength(255, { message: 'Account name must not exceed 255 characters.' })
  name: string;

  @ApiPropertyOptional({ example: 'Technology', description: 'Industry the account belongs to', maxLength: 100 })
  @IsOptional()
  @IsString({ message: 'Industry must be a string.' })
  @MaxLength(100, { message: 'Industry must not exceed 100 characters.' })
  industry?: string;

  @ApiPropertyOptional({ example: 'https://acme.corp', description: 'Website of the account' })
  @IsOptional()
  @IsUrl({}, { message: 'Website must be a valid URL (e.g., http://example.com).' })
  @MaxLength(255, { message: 'Website must not exceed 255 characters.' })
  website?: string;

  @ApiPropertyOptional({ example: '+1-555-123-4567', description: 'Primary phone number for the account', maxLength: 50 })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string.' })
  @MaxLength(50, { message: 'Phone number must not exceed 50 characters.' })
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main St', description: 'Billing address street', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  billingAddressStreet?: string;

  @ApiPropertyOptional({ example: 'Anytown', description: 'Billing address city', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  billingAddressCity?: string;

  @ApiPropertyOptional({ example: 'CA', description: 'Billing address state/province', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  billingAddressState?: string;

  @ApiPropertyOptional({ example: '90210', description: 'Billing address postal code', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  billingAddressPostalCode?: string;

  @ApiPropertyOptional({ example: 'USA', description: 'Billing address country', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  billingAddressCountry?: string;

  @ApiPropertyOptional({ example: '456 Oak Ave', description: 'Shipping address street', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  shippingAddressStreet?: string;

  @ApiPropertyOptional({ example: 'Otherville', description: 'Shipping address city', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  shippingAddressCity?: string;

  @ApiPropertyOptional({ example: 'NY', description: 'Shipping address state/province', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  shippingAddressState?: string;

  @ApiPropertyOptional({ example: '10001', description: 'Shipping address postal code', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  shippingAddressPostalCode?: string;

  @ApiPropertyOptional({ example: 'USA', description: 'Shipping address country', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  shippingAddressCountry?: string;

  @ApiPropertyOptional({ description: 'General notes or description about the account' })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID of the user assigned to this account' })
  @IsOptional()
  @IsNumber({}, { message: 'Assigned user ID must be a number.' })
  @IsPositive({ message: 'Assigned user ID must be a positive number.' })
  assignedToId?: number;
}
