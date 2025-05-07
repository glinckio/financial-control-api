import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../src/common/decorators/public.decorator';

const mockParentCanActivate = jest.fn();
const mockGetAllAndOverride = jest.fn();

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn().mockImplementation(() => {
    return {
      canActivate: mockParentCanActivate,
    };
  }),
}));

jest.mock('@nestjs/core', () => ({
  Reflector: jest.fn().mockImplementation(() => {
    return {
      getAllAndOverride: mockGetAllAndOverride,
    };
  }),
}));

interface MockContext extends Partial<ExecutionContext> {
  getHandler?: () => any;
  getClass?: () => any;
}

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  let mockContext: MockContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);

    mockContext = {
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    };

    mockParentCanActivate.mockReset();
    mockParentCanActivate.mockReturnValue(true);
    mockGetAllAndOverride.mockReset();
    mockGetAllAndOverride.mockReturnValue(false);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when route is public', () => {
    mockGetAllAndOverride.mockReturnValue(true);

    const result = guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(true);
    expect(mockGetAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      mockContext.getHandler?.(),
      mockContext.getClass?.(),
    ]);
  });

  it('should call parent canActivate when route is not public', async () => {
    mockGetAllAndOverride.mockReturnValue(false);

    await guard.canActivate(mockContext as ExecutionContext);

    expect(mockParentCanActivate).toHaveBeenCalledWith(mockContext);
  });

  it('should handle null context', () => {
    mockGetAllAndOverride.mockReturnValue(false);

    expect(() =>
      guard.canActivate(null as unknown as ExecutionContext),
    ).toThrow();
  });

  it('should handle undefined context', () => {
    mockGetAllAndOverride.mockReturnValue(false);

    expect(() =>
      guard.canActivate(undefined as unknown as ExecutionContext),
    ).toThrow();
  });

  it('should handle missing getHandler method', () => {
    mockGetAllAndOverride.mockReturnValue(false);
    const contextWithoutHandler = { ...mockContext };
    delete contextWithoutHandler.getHandler;

    expect(() =>
      guard.canActivate(contextWithoutHandler as ExecutionContext),
    ).toThrow();
  });

  it('should handle missing getClass method', () => {
    mockGetAllAndOverride.mockReturnValue(false);
    const contextWithoutClass = { ...mockContext };
    delete contextWithoutClass.getClass;

    expect(() =>
      guard.canActivate(contextWithoutClass as ExecutionContext),
    ).toThrow();
  });

  it('should handle parent canActivate throwing error', () => {
    mockGetAllAndOverride.mockReturnValue(false);
    mockParentCanActivate.mockImplementation(() => {
      throw new Error('Auth error');
    });

    expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
      'Auth error',
    );
  });

  it('should handle parent canActivate returning false', async () => {
    mockGetAllAndOverride.mockReturnValue(false);
    mockParentCanActivate.mockResolvedValue(false);

    const result = await guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(false);
  });

  it('should handle parent canActivate returning true', async () => {
    mockGetAllAndOverride.mockReturnValue(false);
    mockParentCanActivate.mockResolvedValue(true);

    const result = await guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(true);
  });

  it('should handle parent canActivate returning Promise<boolean>', async () => {
    mockGetAllAndOverride.mockReturnValue(false);
    mockParentCanActivate.mockResolvedValue(Promise.resolve(true));

    const result = await guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(true);
  });
});
