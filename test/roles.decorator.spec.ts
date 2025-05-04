import 'reflect-metadata';
import { Roles, ROLES_KEY } from '../src/common/decorators/roles.decorator';

describe('Roles Decorator', () => {
  it('should set metadata with roles key and roles array', () => {
    const mockSetMetadata = jest.fn();

    // Mock the SetMetadata function
    jest.mock('@nestjs/common', () => ({
      SetMetadata: (...args: unknown[]) => {
        mockSetMetadata(...args);
        return function (): void {};
      },
    }));

    // Create a mock method
    function mockMethod(): void {}

    // Apply the decorator
    Roles('admin', 'user')(mockMethod);

    // Verify that SetMetadata was called with correct arguments
    expect(mockSetMetadata).toHaveBeenCalledWith(ROLES_KEY, ['admin', 'user']);
  });

  it('should be able to retrieve metadata from decorated target', () => {
    // Create a mock method
    function mockMethod(): void {}

    // Apply the decorator
    const decorator = Roles('admin', 'user');
    decorator(mockMethod);

    // Get metadata using Reflect API
    const metadata = Reflect.getMetadata(ROLES_KEY, mockMethod) as string[];
    expect(metadata).toEqual(['admin', 'user']);
  });

  it('should handle empty roles array', () => {
    // Create a mock method
    function mockMethod(): void {}

    // Apply the decorator
    const decorator = Roles();
    decorator(mockMethod);

    // Get metadata using Reflect API
    const metadata = Reflect.getMetadata(ROLES_KEY, mockMethod) as string[];
    expect(metadata).toEqual([]);
  });

  it('should not affect other metadata on the target', () => {
    // Create a mock method
    function mockMethod(): void {}
    const otherMetadataKey = 'otherKey';
    const otherMetadataValue = 'otherValue';

    // Set some other metadata
    Reflect.defineMetadata(otherMetadataKey, otherMetadataValue, mockMethod);

    // Apply the decorator
    const decorator = Roles('admin');
    decorator(mockMethod);

    // Verify other metadata is preserved
    const otherMetadata = Reflect.getMetadata(
      otherMetadataKey,
      mockMethod,
    ) as string;
    const rolesMetadata = Reflect.getMetadata(
      ROLES_KEY,
      mockMethod,
    ) as string[];
    expect(otherMetadata).toBe(otherMetadataValue);
    expect(rolesMetadata).toEqual(['admin']);
  });

  it('should work with class methods', () => {
    class TestClass {
      @Roles('admin', 'user')
      testMethod(): void {}
    }

    const descriptor = Object.getOwnPropertyDescriptor(
      TestClass.prototype,
      'testMethod',
    );
    const metadata = Reflect.getMetadata(
      ROLES_KEY,
      descriptor?.value,
    ) as string[];
    expect(metadata).toEqual(['admin', 'user']);
  });

  it('should work with class declarations', () => {
    @Roles('admin')
    class TestClass {}

    const metadata = Reflect.getMetadata(ROLES_KEY, TestClass) as string[];
    expect(metadata).toEqual(['admin']);
  });

  it('should preserve role order', () => {
    // Create a mock method
    function mockMethod(): void {}

    // Apply the decorator with roles in specific order
    const decorator = Roles('user', 'admin', 'superadmin');
    decorator(mockMethod);

    // Get metadata using Reflect API
    const metadata = Reflect.getMetadata(ROLES_KEY, mockMethod) as string[];
    expect(metadata).toEqual(['user', 'admin', 'superadmin']);
  });

  it('should handle duplicate roles', () => {
    // Create a mock method
    function mockMethod(): void {}

    // Apply the decorator with duplicate roles
    const decorator = Roles('admin', 'user', 'admin');
    decorator(mockMethod);

    // Get metadata using Reflect API
    const metadata = Reflect.getMetadata(ROLES_KEY, mockMethod) as string[];
    expect(metadata).toEqual(['admin', 'user', 'admin']);
  });
});
