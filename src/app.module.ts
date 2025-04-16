import { Module } from '@nestjs/common';
import { ConfigureModule } from './infrastructure/configure/configure.module';

@Module({
  imports: [ConfigureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
