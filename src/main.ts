import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { swaggerConfig } from './main/config/docs/swagger-config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  swaggerConfig(app);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>('PORT') || 3003;

  await app.listen(port, () => logger.log(`Server is running on port ${port}`));
}
bootstrap();
