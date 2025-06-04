import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Base path will be '/api' due to global prefix in main.ts
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status') // This will be available at /api/status
  getAppStatus(): { status: string; message: string; timestamp: string } {
    return this.appService.getAppStatus();
  }
}
