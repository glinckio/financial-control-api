import { DataSource } from 'typeorm';
import { seed } from './seed';
import { getDatabaseConfig } from '../../config/database.config';
import { ConfigService } from '@nestjs/config';

async function runSeed() {
  const configService = new ConfigService();
  const dataSource = new DataSource(getDatabaseConfig(configService) as any);

  try {
    await dataSource.initialize();
    console.log('Running seed...');
    await seed(dataSource);
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();
