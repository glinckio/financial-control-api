import { Test } from '@nestjs/testing';
import { bootstrap } from '../src/main';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../src/common/services/logger.service';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      get: jest.fn().mockImplementation((service) => {
        if (service === ConfigService) {
          return { get: jest.fn().mockReturnValue(3000) };
        }
        if (service === LoggerService) {
          return { log: jest.fn() };
        }
        return undefined;
      }),
      useLogger: jest.fn(),
      use: jest.fn(),
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
      useGlobalFilters: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    }),
  },
}));

describe('Bootstrap', () => {
  let app: INestApplication;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should bootstrap the application with default port', async () => {
    await (bootstrap as () => Promise<void>)();

    const mockApp = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = mockApp.createNestApplication();

    expect(app.get(ConfigService).get('port')).toBe(3000);
  });

  it('should bootstrap the application with custom port', async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue(4000),
    };

    const mockLoggerService = {
      log: jest.fn(),
    };

    const mockApp = {
      get: jest.fn().mockImplementation((service) => {
        if (service === ConfigService) {
          return mockConfigService;
        }
        if (service === LoggerService) {
          return mockLoggerService;
        }
        return undefined;
      }),
      useLogger: jest.fn(),
      use: jest.fn(),
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
      useGlobalFilters: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    jest
      .spyOn(NestFactory, 'create')
      .mockResolvedValue(mockApp as unknown as INestApplication);

    await (bootstrap as () => Promise<void>)();

    expect(mockConfigService.get('port')).toBe(4000);
    expect(mockApp.useLogger).toHaveBeenCalled();
    expect(mockApp.use).toHaveBeenCalledTimes(2);
    expect(mockApp.enableCors).toHaveBeenCalled();
    expect(mockApp.useGlobalPipes).toHaveBeenCalled();
    expect(mockApp.useGlobalFilters).toHaveBeenCalled();
    expect(mockApp.listen).toHaveBeenCalledWith(4000);
  });
});
