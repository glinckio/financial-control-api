import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerService } from './common/services/logger.service';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  app.use(helmet());
  app.use(compression());
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
};

bootstrap();
