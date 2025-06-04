import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './entities/user.entity'; // To be uncommented when User entity is created
// import { UsersService } from './users.service'; // To be uncommented when UsersService is created
// import { UsersController } from './users.controller'; // To be uncommented when UsersController is created

@Module({
  imports: [
    TypeOrmModule.forFeature([/* User */]), // Add User entity here once created
  ],
  // controllers: [UsersController], // Uncomment when UsersController is ready
  // providers: [UsersService], // Uncomment when UsersService is ready
  // exports: [UsersService], // Uncomment to make UsersService available to other modules like AuthModule
})
export class UsersModule {}
