import 'reflect-metadata';
import { Roles, ROLES_KEY } from '../src/common/decorators/roles.decorator';

describe('Roles Decorator', () => {
  it('should set metadata with roles key and roles array', () => {
    const mockSetMetadata = jest.fn();

    jest.mock('@nestjs/common', () => ({
      SetMetadata: (...args: unknown[]) => {
        mockSetMetadata(...args);
        return function (): void {};
      },
    }));

    function mockMethod(): void {}

    Roles('admin', 'user')(mockMethod);

    expect(mockSetMetadata).toHaveBeenCalledWith(ROLES_KEY, ['admin', 'user']);
  });

  it('should be able to retrieve metadata from decorated target', () => {
    function mockMethod(): void {}

    const decorator = Roles('admin', 'user');
    decorator(mockMethod);

    const metadata = Reflect.getMetadata(ROLES_KEY, mockMethod) as string[];
    expect(metadata).toEqual(['admin', 'user']);
  });

  it('should handle empty roles array', () => {
    function mockMethod(): void {}

    const decorator = Roles();
    decorator(mockMethod);

    const metadata = Reflect.getMetadata(ROLES_KEY, mockMethod) as string[];
    expect(metadata).toEqual([]);
  });

  it('should not affect other metadata on the target', () => {
    function mockMethod(): void {}
    const otherMetadataKey = 'otherKey';
    const otherMetadataValue = 'otherValue';

    Reflect.defineMetadata(otherMetadataKey, otherMetadataValue, mockMethod);

    const decorator = Roles('admin');
    decorator(mockMethod);

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
    function mockMethod(): void {}

    const decorator = Roles('user', 'admin', 'superadmin');
    decorator(mockMethod);

    const metadata = Reflect.getMetadata(ROLES_KEY, mockMethod) as string[];
    expect(metadata).toEqual(['user', 'admin', 'superadmin']);
  });

  it('should handle duplicate roles', () => {
    function mockMethod(): void {}

    const decorator = Roles('admin', 'user', 'admin');
    decorator(mockMethod);

    const metadata = Reflect.getMetadata(ROLES_KEY, mockMethod) as string[];
    expect(metadata).toEqual(['admin', 'user', 'admin']);
  });
});
