import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';

// Import feature modules - will be added in subsequent steps
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { LeadsModule } from './leads/leads.module';
// import { OpportunitiesModule } from './opportunities/opportunities.module';
// import { AccountsModule } from './accounts/accounts.module';
// import { ContactsModule } from './contacts/contacts.module';
// import { ProjectsModule } from './projects/projects.module';
// import { TicketsModule } from './tickets/tickets.module';
// import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available throughout the application
      load: [appConfig, databaseConfig, jwtConfig], // Load custom config files
      envFilePath: '.env', // Specifies the .env file path
    }),
    // TypeOrmModule.forRootAsync will be configured later once database.config.ts is defined
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => configService.get('database'),
    //   inject: [ConfigService],
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Serves frontend from root path e.g. localhost:9000/
      exclude: ['/api*'], // Exclude API routes from static serving
    }),
    // Add feature modules here as they are created
    // AuthModule,
    // UsersModule,
    // LeadsModule,
    // OpportunitiesModule,
    // AccountsModule,
    // ContactsModule,
    // ProjectsModule,
    // TicketsModule,
    // ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
