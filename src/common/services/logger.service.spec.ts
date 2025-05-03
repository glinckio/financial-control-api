import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { createLogger, format, transports, Logger } from 'winston';

jest.mock('winston', () => ({
  createLogger: jest.fn(),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    ms: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    printf: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

describe('LoggerService', () => {
  let service: LoggerService;
  let mockLogger: Partial<Logger>;

  beforeEach(async () => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    (createLogger as jest.Mock).mockReturnValue(mockLogger);

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a logger with correct configuration', () => {
    expect(createLogger).toHaveBeenCalled();
    expect(format.combine).toHaveBeenCalled();
    expect(format.timestamp).toHaveBeenCalled();
    expect(format.ms).toHaveBeenCalled();
    expect(format.errors).toHaveBeenCalled();
    expect(format.json).toHaveBeenCalled();
    expect(transports.Console).toHaveBeenCalled();
    expect(transports.File).toHaveBeenCalledTimes(4);
  });

  it('should log info messages', () => {
    const message = 'Test info message';
    const context = 'TestContext';
    service.log(message, context);
    expect(mockLogger.info).toHaveBeenCalledWith(message, { context });
  });

  it('should log error messages', () => {
    const message = 'Test error message';
    const trace = 'Error trace';
    const context = 'TestContext';
    service.error(message, trace, context);
    expect(mockLogger.error).toHaveBeenCalledWith(message, { trace, context });
  });

  it('should log warning messages', () => {
    const message = 'Test warning message';
    const context = 'TestContext';
    service.warn(message, context);
    expect(mockLogger.warn).toHaveBeenCalledWith(message, { context });
  });

  it('should log debug messages', () => {
    const message = 'Test debug message';
    const context = 'TestContext';
    service.debug(message, context);
    expect(mockLogger.debug).toHaveBeenCalledWith(message, { context });
  });

  it('should log verbose messages', () => {
    const message = 'Test verbose message';
    const context = 'TestContext';
    service.verbose(message, context);
    expect(mockLogger.verbose).toHaveBeenCalledWith(message, { context });
  });
});
