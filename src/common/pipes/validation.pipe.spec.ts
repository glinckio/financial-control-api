import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from './validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common';
import { IsString, IsNumber, IsPositive, MinLength } from 'class-validator';

class TestDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsNumber()
  @IsPositive()
  age!: number;
}

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationPipe],
    }).compile();

    pipe = module.get<ValidationPipe>(ValidationPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return value if no metatype is provided', async () => {
    const value = { name: 'Test', age: 25 };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: undefined,
      data: '',
    };
    const result = await pipe.transform(value, metadata);
    expect(result).toBe(value);
  });

  it('should return value if metatype is not a class', async () => {
    const value = { name: 'Test', age: 25 };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: String,
      data: '',
    };
    const result = await pipe.transform(value, metadata);
    expect(result).toBe(value);
  });

  it('should transform and validate valid data', async () => {
    const value = { name: 'Test', age: 25 };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestDto,
      data: '',
    };
    const result = await pipe.transform(value, metadata);
    expect(result).toBeInstanceOf(TestDto);
    expect((result as TestDto).name).toBe('Test');
    expect((result as TestDto).age).toBe(25);
  });

  it('should throw BadRequestException for invalid data', async () => {
    const value = { name: '', age: -1 };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestDto,
      data: '',
    };
    await expect(pipe.transform(value, metadata)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should handle validation errors with proper format', async () => {
    const value = { name: 123 }; // Invalid type
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Object,
      data: '',
    };

    try {
      await pipe.transform(value, metadata);
    } catch (error) {
      if (error instanceof BadRequestException) {
        const response = error.getResponse() as {
          message: string;
          statusCode: number;
          error: string;
          errors: unknown[];
        };
        expect(response).toHaveProperty('message', 'Validation failed');
        expect(response).toHaveProperty('statusCode', 400);
        expect(response).toHaveProperty('error', 'Bad Request');
        expect(response).toHaveProperty('errors');
        expect(Array.isArray(response.errors)).toBe(true);
      } else {
        throw error;
      }
    }
  });
});
