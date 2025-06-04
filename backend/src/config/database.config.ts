import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

// Function to safely parse numeric environment variables
const parseNumber = (value: string | undefined, defaultValue: number): number => {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseNumber(process.env.DB_PORT, 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'crm_db',
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
    // synchronize: process.env.NODE_ENV !== 'production', // Auto-create schema (dev only)
    synchronize: false, // Disable auto-schema creation, use migrations instead
    logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'], // Log queries in dev
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // Basic SSL support, adjust as needed
    cli: {
      migrationsDir: 'src/database/migrations',
      entitiesDir: 'src/**/*.entity.ts',
    },
    extra: {
      // e.g., connection pool settings
      max: parseNumber(process.env.DB_POOL_MAX, 10),
      idleTimeoutMillis: parseNumber(process.env.DB_POOL_IDLE_TIMEOUT, 30000),
    },
  }),
);
