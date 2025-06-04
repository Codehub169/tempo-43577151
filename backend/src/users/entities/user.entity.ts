import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user (must be unique)' })
  @Column({ unique: true, length: 255 })
  email: string;

  @Exclude() // Exclude password from serialization by default
  @Column()
  password?: string; // Optional because we don't always fetch it, and it's not sent to client

  @ApiProperty({ example: ['user', 'admin'], description: 'Roles assigned to the user', type: [String] })
  @Column('simple-array', { default: 'user' })
  roles: string[];

  @ApiProperty({ description: 'Timestamp of user creation' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of last user update' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // TypeORM does not automatically handle @Exclude with query builder's addSelect.
  // The service layer needs to manage password exclusion for most cases.
  // However, @Exclude works well with classToPlain transformations which NestJS uses.
}
