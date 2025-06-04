import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength, IsEmail, IsArray, ArrayNotEmpty, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'User\'s full name',
    example: 'Jane Doe',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name?: string;

  @ApiPropertyOptional({
    description: 'User\'s email address',
    example: 'jane.doe@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email?: string;

  @ApiPropertyOptional({
    description: 'User\'s password (at least 8 characters)',
    example: 'newSecurePassword123',
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @ApiPropertyOptional({
    description: 'User roles',
    example: ['user', 'editor'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Roles must be an array' })
  @ArrayNotEmpty({ message: 'Roles array cannot be empty if provided' })
  @IsString({ each: true, message: 'Each role must be a string' })
  @ValidateIf(o => o.roles !== undefined) // Apply validation only if roles is provided
  roles?: string[];
}
