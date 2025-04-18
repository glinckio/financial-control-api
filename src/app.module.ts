import { Module } from '@nestjs/common';
import { ConfigureModule } from './infrastructure/configure/configure.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserModule } from './infrastructure/ioc/user';

@Module({
  imports: [ConfigureModule, DatabaseModule, UserModule],
})
export class AppModule {}
