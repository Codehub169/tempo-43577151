import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';
import { Project } from '../projects/entities/project.entity';
// import { TicketComment } from './entities/ticket-comment.entity'; // To be implemented later
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      User, 
      Account, 
      Project,
      // TicketComment, // Add when TicketComment entity is created
    ]),
    AuthModule, // For JwtAuthGuard
    UsersModule, // For User repository access if needed beyond direct relations
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
