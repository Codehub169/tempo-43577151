import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesService } from './activities.service';
// import { ActivitiesController } from './activities.controller'; // Controller will be added in a later batch
import { Activity } from './entities/activity.entity';
import { User } from '../users/entities/user.entity';
import { Lead } from '../leads/entities/lead.entity';
import { Opportunity } from '../opportunities/entities/opportunity.entity';
import { Account } from '../accounts/entities/account.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { Project } from '../projects/entities/project.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      User, 
      Lead,
      Opportunity,
      Account,
      Contact,
      Project,
      Ticket
    ]),
    AuthModule, // For JWTGuard if controller is protected
    UsersModule, // To access UsersService/Repository if needed beyond basic User entity
  ],
  // controllers: [ActivitiesController], // Controller to be added later
  providers: [ActivitiesService],
  exports: [ActivitiesService], // Export service if other modules need to log activities directly
})
export class ActivitiesModule {}
