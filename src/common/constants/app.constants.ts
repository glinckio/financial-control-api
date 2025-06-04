export const APP_CONSTANTS = {
  API_PREFIX: 'api',
  API_VERSION: 'v1',
  DEFAULT_PORT: 3000,
  DEFAULT_DATABASE_PORT: 5432,
  DEFAULT_DATABASE_HOST: 'localhost',
  DEFAULT_DATABASE_USERNAME: 'postgres',
  DEFAULT_DATABASE_PASSWORD: 'postgres',
  DEFAULT_DATABASE_NAME: 'project_name',
  JWT_EXPIRATION: '1d',
  MAIL_HOST: 'smtp.gmail.com',
  MAIL_PORT: 587,
} as const;

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  VALIDATION_FAILED: 'Validation failed',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
} as const;
