import { ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './database.config';
import { EntitySchema } from 'typeorm';

describe('Database Config', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService({
      database: {
        host: 'test-host',
        port: 5432,
        username: 'test-user',
        password: 'test-pass',
        database: 'test-db',
      },
    });
  });

  it('should return TypeOrmModuleOptions with correct values', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const config = getDatabaseConfig(configService);

    // Test basic configuration
    expect(config).toEqual(
      expect.objectContaining({
        type: 'postgres',
        host: 'test-host',
        port: 5432,
        username: 'test-user',
        password: 'test-pass',
        database: 'test-db',
        synchronize: true,
        logging: true,
        migrationsRun: true,
      }),
    );

    // Test path patterns
    expect(config.entities).toBeDefined();
    expect(Array.isArray(config.entities)).toBe(true);
    const entities = config.entities as (
      | string
      | ((...args: unknown[]) => unknown)
      | EntitySchema<any>
    )[];
    const entityPath = entities.find(
      (path): path is string => typeof path === 'string',
    );
    expect(entityPath).toBeDefined();
    expect(entityPath).toMatch(/entities[/\\].*\.entity\{\.ts,\.js\}$/);

    expect(config.migrations).toBeDefined();
    expect(Array.isArray(config.migrations)).toBe(true);
    const migrations = config.migrations as (
      | string
      | ((...args: unknown[]) => unknown)
    )[];
    const migrationPath = migrations.find(
      (path): path is string => typeof path === 'string',
    );
    expect(migrationPath).toBeDefined();
    expect(migrationPath).toMatch(/migrations[/\\].*\{\.ts,\.js\}$/);

    process.env.NODE_ENV = originalEnv;
  });

  it('should disable synchronize and logging in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const config = getDatabaseConfig(configService);

    expect(config.synchronize).toBe(false);
    expect(config.logging).toBe(false);

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle test environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';

    const config = getDatabaseConfig(configService);

    expect(config.synchronize).toBe(true);
    expect(config.logging).toBe(false);

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle undefined environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = undefined;

    const config = getDatabaseConfig(configService);

    expect(config.synchronize).toBe(true);
    expect(config.logging).toBe(true);

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle missing database configuration', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const emptyConfigService = new ConfigService({});
    const config = getDatabaseConfig(emptyConfigService);

    expect(config).toEqual(
      expect.objectContaining({
        type: 'postgres',
        host: undefined,
        port: undefined,
        username: undefined,
        password: undefined,
        database: undefined,
        synchronize: true,
        logging: true,
        migrationsRun: true,
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });
});
