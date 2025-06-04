import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User\'s full name',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @ApiProperty({
    description: 'User\'s email address (must be unique)',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @ApiProperty({
    description: 'User\'s password (at least 8 characters)',
    example: 'P@$$wOrd123',
    required: true,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'Roles assigned to the user. Defaults to [\'user\'] if not provided.',
    example: ['user', 'editor'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ each: false, message: 'Roles array should not be empty if provided' })
  @IsString({ each: true, message: 'Each role must be a string' })
  roles?: string[];
}
