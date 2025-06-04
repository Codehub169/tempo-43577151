import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppStatus(): { status: string; message: string; timestamp: string } {
    return {
      status: 'success',
      message: 'CRM API is running smoothly!',
      timestamp: new Date().toISOString(),
    };
  }
}
