import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Account } from '../accounts/entities/account.entity'; // Added for relation checks
import { Contact } from '../contacts/entities/contact.entity'; // Added for relation checks

@Module({
  imports: [
    TypeOrmModule.forFeature([Opportunity, Account, Contact]), // Include Account and Contact for service logic
    AuthModule,
    UsersModule,
  ],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}
