import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead } from './entities/lead.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module'; // For assigning users to leads

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead]),
    AuthModule, // For route protection
    UsersModule, // To resolve user entities if needed (e.g., for assignedTo)
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService], // Export if other modules need to use LeadsService (e.g., for lead conversion)
})
export class LeadsModule {}
