/**
 * Server configuration
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Server configuration
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MOBILE_CLIENT_URL: process.env.MOBILE_CLIENT_URL || 'http://localhost:8081',
};

// Game configuration
export const GAME_CONFIG = {
  MAX_PLAYERS_PER_GAME: 2,
  TURN_TIMEOUT_SECONDS: 30,
  MATCHMAKING_TIMEOUT_SECONDS: 60,
};

// Database configuration (for future implementation)
export const DB_CONFIG = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: process.env.DB_PORT || 5432,
  USER: process.env.DB_USER || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DATABASE: process.env.DB_NAME || 'sea_battle',
};

// Redis configuration (for future implementation)
export const REDIS_CONFIG = {
  HOST: process.env.REDIS_HOST || 'localhost',
  PORT: process.env.REDIS_PORT || 6379,
  PASSWORD: process.env.REDIS_PASSWORD || '',
};

export default {
  SERVER: SERVER_CONFIG,
  GAME: GAME_CONFIG,
  DB: DB_CONFIG,
  REDIS: REDIS_CONFIG,
}; 