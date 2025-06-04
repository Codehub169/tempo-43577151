import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({
    description: 'The content of the comment.',
    example: 'I have investigated the issue and found a workaround.',
    minLength: 1,
    type: 'string',
    format: 'text',
  })
  @IsString({ message: 'Comment content must be a string.' })
  @IsNotEmpty({ message: 'Comment content cannot be empty.' })
  @MinLength(1, { message: 'Comment content must be at least 1 character long.' })
  content: string;
}
