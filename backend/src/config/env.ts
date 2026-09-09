import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'COOKIE_SECRET',
  'CLIENT_URL',
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  // Server
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGODB_URI: process.env.MONGODB_URI as string,

  // Redis
  REDIS_URL: process.env.REDIS_URL || '',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_ENABLED: process.env.REDIS_ENABLED === 'true',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',

  // Email
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '',

  // Client / CORS
  CLIENT_URL: process.env.CLIENT_URL as string,

  // Stripe (server secret never leaves the backend)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',

  // Cookie
  COOKIE_SECRET: process.env.COOKIE_SECRET as string,

  // Upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 5242880,
};
