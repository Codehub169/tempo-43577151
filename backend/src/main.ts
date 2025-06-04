import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  // Global prefix for all API routes
  app.setGlobalPrefix('api');

  // CORS configuration
  app.enableCors({
    origin: true, // Reflects the request origin, or use a specific array of origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global pipes for validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that do not have any decorators
      transform: true, // Automatically transforms payloads to DTO instances
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transformOptions: {
        enableImplicitConversion: true, // Convert query/path params to primitive types if possible
      },
    }),
  );

  // Serve static frontend assets
  // The 'public' directory is where Dockerfile.backend places the built frontend assets
  // If src/main.ts compiles to dist/main.js, then __dirname is 'dist'.
  // The 'public' folder is copied to be a sibling of 'dist' in the container's app root, e.g., /usr/src/app/public and /usr/src/app/dist/main.js
  // So, from 'dist/main.js', the path to 'public' is '../public'.
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT') || 9000;

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`Frontend should be available at: http://localhost:${port}`);
}
bootstrap();
