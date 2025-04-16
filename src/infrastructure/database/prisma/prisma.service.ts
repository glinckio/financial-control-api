import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(public configService: ConfigService) {
    const url = PrismaService.getDatabaseUrl(configService);

    super({
      datasources: {
        db: {
          url,
        },
      },
      log: ['error', 'warn', 'info', 'query'],
    });

    this.logger.log(
      `Attempting to connect with URL: ${this.maskDatabaseUrl(url)}`,
    );
  }

  private static getDatabaseUrl(configService: ConfigService): string {
    const host = configService.get<string>('POSTGRES_HOST');
    const port = configService.get<string>('POSTGRES_PORT');
    const user = configService.get<string>('POSTGRES_USER');
    const password = configService.get<string>('POSTGRES_PASSWORD');
    const database = configService.get<string>('POSTGRES_DB');

    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }

  private maskDatabaseUrl(url: string): string {
    try {
      const maskedUrl = new URL(url);
      if (maskedUrl.password) {
        maskedUrl.password = '****';
      }
      return maskedUrl.toString();
    } catch {
      return url.replace(/\/\/.*@/, '//*****:*****@');
    }
  }

  async onModuleInit() {
    try {
      this.logger.log('Attempting to connect to database...');
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error(
        `Failed to connect to database: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
