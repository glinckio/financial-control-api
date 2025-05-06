import 'reflect-metadata';
import {
  IS_PUBLIC_KEY,
  Public,
} from '../src/common/decorators/public.decorator';
import { SetMetadata } from '@nestjs/common';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Public Decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call SetMetadata with correct key and value', () => {
    Public();

    expect(SetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
  });

  it('should only be called once per usage', () => {
    Public();

    expect(SetMetadata).toHaveBeenCalledTimes(1);
  });

  it('should always set isPublic to true', () => {
    Public();

    expect(SetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
  });

  it('should set metadata with isPublic key and true value', () => {
    const mockSetMetadata = jest.fn();

    jest.mock('@nestjs/common', () => ({
      SetMetadata: (...args: unknown[]) => {
        mockSetMetadata(...args);
        return function (): void {};
      },
    }));

    function mockMethod(): void {}

    Public()(mockMethod);

    expect(mockSetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
  });

  it('should be able to retrieve metadata from decorated target', () => {
    function mockMethod(): void {}

    const decorator = Public();
    decorator(mockMethod);

    const metadata = Reflect.getMetadata(IS_PUBLIC_KEY, mockMethod) as boolean;
    expect(metadata).toBe(true);
  });

  it('should not affect other metadata on the target', () => {
    function mockMethod(): void {}
    const otherMetadataKey = 'otherKey';
    const otherMetadataValue = 'otherValue';

    Reflect.defineMetadata(otherMetadataKey, otherMetadataValue, mockMethod);

    const decorator = Public();
    decorator(mockMethod);

    const otherMetadata = Reflect.getMetadata(
      otherMetadataKey,
      mockMethod,
    ) as string;
    const publicMetadata = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      mockMethod,
    ) as boolean;
    expect(otherMetadata).toBe(otherMetadataValue);
    expect(publicMetadata).toBe(true);
  });

  it('should work with class methods', () => {
    class TestClass {
      @Public()
      testMethod(): void {}
    }

    const descriptor = Object.getOwnPropertyDescriptor(
      TestClass.prototype,
      'testMethod',
    );
    const metadata = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      descriptor?.value,
    ) as boolean;
    expect(metadata).toBe(true);
  });

  it('should work with class declarations', () => {
    @Public()
    class TestClass {}

    const metadata = Reflect.getMetadata(IS_PUBLIC_KEY, TestClass) as boolean;
    expect(metadata).toBe(true);
  });
});
