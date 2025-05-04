import { Test, TestingModule } from '@nestjs/testing';
import { LoggingInterceptor } from './logging.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { Response } from 'express';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockLogger: Partial<LoggerService>;
  let mockCallHandler: Partial<CallHandler>;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of('test response')),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggingInterceptor,
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log request and response', async () => {
    const mockResponse: Partial<Response> = {
      statusCode: 200,
    };

    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          body: { test: 'data' },
        }),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
      getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
    };

    const result = await interceptor
      .intercept(
        mockContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .toPromise();

    expect(result).toBe('test response');
    expect(mockLogger.log).toHaveBeenCalledTimes(2);
    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('Request'),
      expect.any(String),
    );
    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('Response'),
      expect.any(String),
    );
  });

  it('should handle errors with status code', async () => {
    const mockResponse: Partial<Response> = {
      statusCode: 500,
    };

    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          body: { test: 'data' },
        }),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
      getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
    };

    const error = new Error('Test error') as Error & { status: number };
    error.status = 400;
    mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    await expect(
      interceptor
        .intercept(
          mockContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .toPromise(),
    ).rejects.toThrow('Test error');

    expect(mockLogger.log).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('Request'),
      expect.any(String),
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('GET /test 400'),
      expect.any(String),
      'LoggingInterceptor',
    );
  });

  it('should handle errors without status code', async () => {
    const mockResponse: Partial<Response> = {
      statusCode: 500,
    };

    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          body: { test: 'data' },
        }),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
      getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
    };

    const error = new Error('Test error');
    mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    await expect(
      interceptor
        .intercept(
          mockContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .toPromise(),
    ).rejects.toThrow('Test error');

    expect(mockLogger.log).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('Request'),
      expect.any(String),
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('GET /test 500'),
      expect.any(String),
      'LoggingInterceptor',
    );
  });

  it('should handle errors without stack trace', async () => {
    const mockResponse: Partial<Response> = {
      statusCode: 500,
    };

    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          body: { test: 'data' },
        }),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
      getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
    };

    const error = { message: 'Test error', status: 500 } as Error & {
      status: number;
    };
    mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    await expect(
      interceptor
        .intercept(
          mockContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .toPromise(),
    ).rejects.toEqual(error);

    expect(mockLogger.log).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('GET /test 500'),
      '',
      'LoggingInterceptor',
    );
  });

  it('should handle errors with empty message', async () => {
    const mockResponse: Partial<Response> = {
      statusCode: 500,
    };

    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          body: { test: 'data' },
        }),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
      getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
    };

    const error = { status: 500 } as Error & { status: number };
    mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    await expect(
      interceptor
        .intercept(
          mockContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .toPromise(),
    ).rejects.toEqual(error);

    expect(mockLogger.log).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('GET /test 500'),
      '',
      'LoggingInterceptor',
    );
  });

  it('should handle errors with non-standard error object', async () => {
    const mockResponse: Partial<Response> = {
      statusCode: 500,
    };

    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
          body: { test: 'data' },
        }),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
      getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
    };

    const error = { customField: 'test' } as unknown as Error;
    mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    await expect(
      interceptor
        .intercept(
          mockContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .toPromise(),
    ).rejects.toEqual(error);

    expect(mockLogger.log).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('GET /test 500'),
      '',
      'LoggingInterceptor',
    );
  });
});
