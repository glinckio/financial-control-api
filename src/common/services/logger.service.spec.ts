import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { createLogger, format, transports, Logger } from 'winston';

interface LogInfo {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  additional?: string;
  [key: string]: unknown;
}

jest.mock('winston', () => ({
  createLogger: jest.fn(),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    ms: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    printf: jest.fn((template: (info: LogInfo) => string) => template),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

describe('LoggerService', () => {
  let service: LoggerService;
  let mockLogger: Partial<Logger>;
  let mockPrintfTemplate: (info: LogInfo) => string;

  beforeEach(async () => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    (createLogger as jest.Mock).mockReturnValue(mockLogger);

    (format.printf as jest.Mock).mockImplementation(
      (template: (info: LogInfo) => string) => {
        mockPrintfTemplate = template;
        return template;
      },
    );

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
    expect(format.errors).toHaveBeenCalledWith({ stack: true });
    expect(format.json).toHaveBeenCalled();
    expect(transports.Console).toHaveBeenCalled();
    expect(transports.File).toHaveBeenCalledWith({
      filename: 'logs/error.log',
      level: 'error',
    });
    expect(transports.File).toHaveBeenCalledWith({
      filename: 'logs/combined.log',
    });
  });

  it('should format log messages correctly with metadata', () => {
    const logInfo = {
      timestamp: '2024-01-01T12:00:00Z',
      level: 'info',
      message: 'Test message',
      context: 'TestContext',
      additional: 'data',
    };

    const formattedMessage = mockPrintfTemplate(logInfo);
    expect(formattedMessage).toContain('2024-01-01T12:00:00Z');
    expect(formattedMessage).toContain('[info]');
    expect(formattedMessage).toContain('Test message');
    expect(formattedMessage).toContain('"context": "TestContext"');
    expect(formattedMessage).toContain('"additional": "data"');
  });

  it('should format log messages correctly without metadata', () => {
    const logInfo = {
      timestamp: '2024-01-01T12:00:00Z',
      level: 'info',
      message: 'Test message',
    };

    const formattedMessage = mockPrintfTemplate(logInfo);
    expect(formattedMessage).toContain('2024-01-01T12:00:00Z');
    expect(formattedMessage).toContain('[info]');
    expect(formattedMessage).toContain('Test message');
    expect(formattedMessage.endsWith('Test message ')).toBe(true);
  });

  it('should log info messages with context', () => {
    const message = 'Test info message';
    const context = 'TestContext';
    service.log(message, context);
    expect(mockLogger.info).toHaveBeenCalledWith(message, { context });
  });

  it('should log info messages without context', () => {
    const message = 'Test info message';
    service.log(message);
    expect(mockLogger.info).toHaveBeenCalledWith(message, {
      context: undefined,
    });
  });

  it('should log error messages with trace and context', () => {
    const message = 'Test error message';
    const trace = 'Error trace';
    const context = 'TestContext';
    service.error(message, trace, context);
    expect(mockLogger.error).toHaveBeenCalledWith(message, { trace, context });
  });

  it('should log error messages without trace or context', () => {
    const message = 'Test error message';
    service.error(message);
    expect(mockLogger.error).toHaveBeenCalledWith(message, {
      trace: undefined,
      context: undefined,
    });
  });

  it('should log warning messages with context', () => {
    const message = 'Test warning message';
    const context = 'TestContext';
    service.warn(message, context);
    expect(mockLogger.warn).toHaveBeenCalledWith(message, { context });
  });

  it('should log warning messages without context', () => {
    const message = 'Test warning message';
    service.warn(message);
    expect(mockLogger.warn).toHaveBeenCalledWith(message, {
      context: undefined,
    });
  });

  it('should log debug messages with context', () => {
    const message = 'Test debug message';
    const context = 'TestContext';
    service.debug(message, context);
    expect(mockLogger.debug).toHaveBeenCalledWith(message, { context });
  });

  it('should log debug messages without context', () => {
    const message = 'Test debug message';
    service.debug(message);
    expect(mockLogger.debug).toHaveBeenCalledWith(message, {
      context: undefined,
    });
  });

  it('should log verbose messages with context', () => {
    const message = 'Test verbose message';
    const context = 'TestContext';
    service.verbose(message, context);
    expect(mockLogger.verbose).toHaveBeenCalledWith(message, { context });
  });

  it('should log verbose messages without context', () => {
    const message = 'Test verbose message';
    service.verbose(message);
    expect(mockLogger.verbose).toHaveBeenCalledWith(message, {
      context: undefined,
    });
  });
});
