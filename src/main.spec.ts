import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './common/services/logger.service';
import { INestApplication } from '@nestjs/common';

const mockHelmetMiddleware = jest.fn();
const mockCompressionMiddleware = jest.fn();
const mockHelmet = jest.fn(() => mockHelmetMiddleware);
const mockCompression = jest.fn(() => mockCompressionMiddleware);

jest.mock('@nestjs/core');
jest.mock('./app.module');
jest.mock('@nestjs/config');
jest.mock('./common/services/logger.service');
jest.mock('helmet', () => mockHelmet);
jest.mock('compression', () => mockCompression);

describe('Bootstrap', () => {
  let mockApp: Partial<INestApplication>;
  let mockConfigService: Partial<ConfigService>;
  let mockLogger: Partial<LoggerService>;

  beforeEach(() => {
    mockApp = {
      get: jest.fn(),
      use: jest.fn(),
      useLogger: jest.fn(),
      useGlobalPipes: jest.fn(),
      useGlobalFilters: jest.fn(),
      enableCors: jest.fn(),
      listen: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn().mockReturnValue(3000),
    };

    mockLogger = {
      log: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
    (mockApp.get as jest.Mock).mockImplementation((token: unknown) => {
      if (token === ConfigService) return mockConfigService;
      if (token === LoggerService) return mockLogger;
      return null;
    });
  });

  it('should bootstrap the application with correct configuration', async () => {
    const mainModule = await import('./main');
    const bootstrap = (
      mainModule as unknown as { bootstrap: () => Promise<void> }
    ).bootstrap;

    await bootstrap();

    const createMock = jest.spyOn(NestFactory, 'create');
    expect(createMock).toHaveBeenCalledWith(AppModule, {
      logger: false,
    });

    expect(mockConfigService.get).toHaveBeenCalledWith('port');

    expect(mockApp.use).toHaveBeenCalledTimes(4);
    expect(mockApp.use).toHaveBeenCalledWith(mockHelmetMiddleware);
    expect(mockApp.use).toHaveBeenCalledWith(mockCompressionMiddleware);
    expect(mockApp.enableCors).toHaveBeenCalled();

    expect(mockApp.useGlobalPipes).toHaveBeenCalled();
    expect(mockApp.useGlobalFilters).toHaveBeenCalled();

    expect(mockApp.listen).toHaveBeenCalledWith(3000);
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Application is running on: http://localhost:3000',
    );
  });
});
