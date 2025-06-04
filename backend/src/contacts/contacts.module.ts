import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Contact } from './entities/contact.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Account } from '../accounts/entities/account.entity';
import { User } from '../users/entities/user.entity';
import { Opportunity } from '../opportunities/entities/opportunity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, Account, User, Opportunity]),
    AuthModule,
    UsersModule,
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
