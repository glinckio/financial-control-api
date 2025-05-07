import { LoggerService } from './logger.service';
import * as winston from 'winston';

interface MockLogger {
  info: jest.Mock;
  error: jest.Mock;
  warn: jest.Mock;
  debug: jest.Mock;
  verbose: jest.Mock;
}

jest.mock('winston', () => {
  const mockFormat = {
    combine: jest.fn().mockReturnThis(),
    timestamp: jest.fn().mockReturnThis(),
    ms: jest.fn().mockReturnThis(),
    errors: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  const mockTransports = {
    Console: jest.fn(),
    File: jest.fn(),
  };

  return {
    format: mockFormat,
    transports: mockTransports,
    createLogger: jest.fn().mockReturnValue({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    }),
  };
});

describe('LoggerService', () => {
  let service: LoggerService;
  let mockLogger: MockLogger;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LoggerService();
    mockLogger = (winston.createLogger as jest.Mock).mock.results[0].value;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log info message', () => {
    service.log('test message');
    expect(mockLogger.info).toHaveBeenCalledWith('test message', {
      context: undefined,
    });
  });

  it('should log error message', () => {
    service.error('test error', 'test trace');
    expect(mockLogger.error).toHaveBeenCalledWith('test error', {
      trace: 'test trace',
    });
  });

  it('should log warning message', () => {
    service.warn('test warning');
    expect(mockLogger.warn).toHaveBeenCalledWith('test warning', {
      context: undefined,
    });
  });

  it('should log debug message', () => {
    service.debug('test debug');
    expect(mockLogger.debug).toHaveBeenCalledWith('test debug', {
      context: undefined,
    });
  });

  it('should log verbose message', () => {
    service.verbose('test verbose');
    expect(mockLogger.verbose).toHaveBeenCalledWith('test verbose', {
      context: undefined,
    });
  });
});
