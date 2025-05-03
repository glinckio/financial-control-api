import { BusinessException } from './business.exception';
import { HttpStatus } from '@nestjs/common';

describe('BusinessException', () => {
  it('should create a business exception with default status', () => {
    const message = 'Test error message';
    const exception = new BusinessException(message);

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.getResponse()).toEqual({
      statusCode: HttpStatus.BAD_REQUEST,
      message,
      error: 'Business Error',
    });
  });

  it('should create a business exception with custom status', () => {
    const message = 'Test error message';
    const status = HttpStatus.CONFLICT;
    const exception = new BusinessException(message, status);

    expect(exception.getStatus()).toBe(status);
    expect(exception.getResponse()).toEqual({
      statusCode: status,
      message,
      error: 'Business Error',
    });
  });
});
