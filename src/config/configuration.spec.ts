import configuration from './configuration';

describe('Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should use default values when environment variables are not set', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const config = configuration();
    expect(config.port).toBe(3000);
    expect(config.database).toEqual({
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'project_name',
    });
    expect(config.jwt).toEqual({
      secret: undefined,
      expiresIn: '1d',
    });
    expect(config.mail).toEqual({
      host: 'smtp.gmail.com',
      port: 587,
      user: '',
      password: '',
      from: '',
    });

    process.env.NODE_ENV = originalEnv;
  });

  it('should use environment variables when set', () => {
    process.env.PORT = '4000';
    process.env.DATABASE_HOST = 'test-host';
    process.env.DATABASE_PORT = '5433';
    process.env.DATABASE_USERNAME = 'test-user';
    process.env.DATABASE_PASSWORD = 'test-pass';
    process.env.DATABASE_NAME = 'test-db';
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '2d';
    process.env.MAIL_HOST = 'test-smtp';
    process.env.MAIL_PORT = '588';
    process.env.MAIL_USER = 'test@example.com';
    process.env.MAIL_PASSWORD = 'mail-pass';
    process.env.MAIL_FROM = 'from@example.com';

    const config = configuration();
    expect(config.port).toBe(4000);
    expect(config.database).toEqual({
      host: 'test-host',
      port: 5433,
      username: 'test-user',
      password: 'test-pass',
      database: 'test-db',
    });
    expect(config.jwt).toEqual({
      secret: 'test-secret',
      expiresIn: '2d',
    });
    expect(config.mail).toEqual({
      host: 'test-smtp',
      port: 588,
      user: 'test@example.com',
      password: 'mail-pass',
      from: 'from@example.com',
    });
  });

  it('should handle invalid port numbers', () => {
    process.env.PORT = 'invalid';
    process.env.DATABASE_PORT = 'invalid';
    process.env.MAIL_PORT = 'invalid';

    const config = configuration();
    expect(config.port).toBe(3000);
    expect(config.database.port).toBe(5432);
    expect(config.mail.port).toBe(587);
  });

  it('should handle empty string port numbers', () => {
    process.env.PORT = '';
    process.env.DATABASE_PORT = '';
    process.env.MAIL_PORT = '';

    const config = configuration();
    expect(config.port).toBe(3000);
    expect(config.database.port).toBe(5432);
    expect(config.mail.port).toBe(587);
  });

  it('should handle undefined port numbers', () => {
    process.env.PORT = undefined;
    process.env.DATABASE_PORT = undefined;
    process.env.MAIL_PORT = undefined;

    const config = configuration();
    expect(config.port).toBe(3000);
    expect(config.database.port).toBe(5432);
    expect(config.mail.port).toBe(587);
  });

  it('should handle negative port numbers', () => {
    process.env.PORT = '-1';
    process.env.DATABASE_PORT = '-1';
    process.env.MAIL_PORT = '-1';

    const config = configuration();
    expect(config.port).toBe(3000);
    expect(config.database.port).toBe(5432);
    expect(config.mail.port).toBe(587);
  });

  it('should handle zero port numbers', () => {
    process.env.PORT = '0';
    process.env.DATABASE_PORT = '0';
    process.env.MAIL_PORT = '0';

    const config = configuration();
    expect(config.port).toBe(3000);
    expect(config.database.port).toBe(5432);
    expect(config.mail.port).toBe(587);
  });

  it('should handle empty string values for non-port fields', () => {
    process.env.DATABASE_HOST = '';
    process.env.DATABASE_USERNAME = '';
    process.env.DATABASE_PASSWORD = '';
    process.env.DATABASE_NAME = '';
    process.env.JWT_SECRET = '';
    process.env.JWT_EXPIRES_IN = '';
    process.env.MAIL_HOST = '';
    process.env.MAIL_USER = '';
    process.env.MAIL_PASSWORD = '';
    process.env.MAIL_FROM = '';

    const config = configuration();
    expect(config.database).toEqual({
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'project_name',
    });
    expect(config.jwt).toEqual({
      secret: undefined,
      expiresIn: '1d',
    });
    expect(config.mail).toEqual({
      host: 'smtp.gmail.com',
      port: 587,
      user: '',
      password: '',
      from: '',
    });
  });
});
