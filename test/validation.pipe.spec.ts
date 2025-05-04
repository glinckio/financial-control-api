import { ValidationPipe } from '../src/common/pipes/validation.pipe';
import { BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

interface ValidationError {
  property: string;
  constraints: Record<string, string>;
}

interface ValidationErrorResponse {
  message: string;
  errors: ValidationError[];
}

class TestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  age!: number;
}

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  it('should return value if metatype is not provided', async () => {
    const value = { name: 'test', age: 25 };
    const metadata: ArgumentMetadata = { type: 'body', metatype: undefined };
    const result = await pipe.transform(value, metadata);
    expect(result).toEqual(value);
  });

  it('should return value if metatype is a primitive type', async () => {
    const value = 'test';
    const metadata: ArgumentMetadata = { type: 'body', metatype: String };
    const result = await pipe.transform(value, metadata);
    expect(result).toEqual(value);
  });

  it('should transform and validate object successfully', async () => {
    const value = { name: 'test', age: 25 };
    const metadata: ArgumentMetadata = { type: 'body', metatype: TestDto };
    const result = await pipe.transform(value, metadata);
    expect(result).toBeInstanceOf(TestDto);
    expect(result).toEqual(value);
  });

  it('should throw BadRequestException when validation fails', async () => {
    const value = { name: '', age: 'not a number' };
    const metadata: ArgumentMetadata = { type: 'body', metatype: TestDto };

    await expect(pipe.transform(value, metadata)).rejects.toThrow(
      BadRequestException,
    );

    try {
      await pipe.transform(value, metadata);
    } catch (error) {
      const badRequestError = error as BadRequestException;
      const response = badRequestError.getResponse() as ValidationErrorResponse;
      expect(response).toEqual({
        message: 'Validation failed',
        errors: expect.arrayContaining([
          expect.objectContaining({
            property: 'name',
            constraints: expect.any(Object),
          }),
          expect.objectContaining({
            property: 'age',
            constraints: expect.any(Object),
          }),
        ]),
      });
    }
  });

  it('should handle empty object', async () => {
    const value = {};
    const metadata: ArgumentMetadata = { type: 'body', metatype: TestDto };
    await expect(pipe.transform(value, metadata)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should handle null value', async () => {
    const value = null;
    const metadata: ArgumentMetadata = { type: 'body', metatype: TestDto };
    const result = await pipe.transform(value, metadata);
    expect(result).toBeNull();
  });
});
