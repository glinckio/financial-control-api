import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const env = process.env.NODE_ENV;
  const isProduction = env === 'production';
  const isTest = env === 'test';

  return {
    type: 'postgres',
    host: configService.get('database.host'),
    port: configService.get('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    database: configService.get('database.database'),
    entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
    synchronize: !isProduction,
    logging: !isTest && !isProduction,
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: true,
  };
};
