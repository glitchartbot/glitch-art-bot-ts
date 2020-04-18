import logger from './logger';
import dotenv from 'dotenv';
import { existsSync } from 'fs';

if (existsSync('.env') && !existsSync('.env.test')) {
  logger.debug('Using production environment variables');
  dotenv.config({ path: '.env' });
} else if (existsSync('.env.test')) {
  logger.debug('Using development environment variables');
  dotenv.config({ path: '.env.test' });
} else {
  logger.error('No .env file found');
  process.exit(1);
}

export const ENVIRONMENT = process.env.NODE_ENV;