import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { ROLES_KEY } from '../src/common/decorators/roles.decorator';

const mockGetAllAndOverride = jest.fn();

jest.mock('@nestjs/core', () => ({
  Reflector: jest.fn().mockImplementation(() => {
    return {
      getAllAndOverride: mockGetAllAndOverride,
    };
  }),
}));

interface MockRequest {
  user?: {
    roles?: string[];
  };
}

interface MockHttpContext {
  getRequest: () => MockRequest;
  getResponse: () => Record<string, unknown>;
  getNext: () => Record<string, unknown>;
}

interface MockContext {
  getHandler?: () => unknown;
  getClass?: () => unknown;
  switchToHttp?: () => MockHttpContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockContext: MockContext;
  let mockRequest: MockRequest;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);

    mockRequest = {
      user: {
        roles: ['user'],
      },
    };

    mockContext = {
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
    };

    mockGetAllAndOverride.mockReset();
    mockGetAllAndOverride.mockReturnValue(null);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when no roles are required', () => {
    mockGetAllAndOverride.mockReturnValue(null);

    const result = guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(true);
    expect(mockGetAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      mockContext.getHandler?.(),
      mockContext.getClass?.(),
    ]);
  });

  it('should return true when user has required role', () => {
    mockGetAllAndOverride.mockReturnValue(['user', 'admin']);

    const result = guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(true);
  });

  it('should return false when user does not have required role', () => {
    mockGetAllAndOverride.mockReturnValue(['admin']);

    const result = guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(false);
  });

  it('should return false when user has no roles', () => {
    mockGetAllAndOverride.mockReturnValue(['admin']);
    mockRequest.user!.roles = undefined;

    const result = guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(false);
  });

  it('should return false when user is not present in request', () => {
    mockGetAllAndOverride.mockReturnValue(['admin']);
    mockRequest.user = undefined;

    const result = guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(false);
  });

  it('should handle empty roles array', () => {
    mockGetAllAndOverride.mockReturnValue([]);

    const result = guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(false);
  });

  it('should handle multiple required roles', () => {
    mockGetAllAndOverride.mockReturnValue(['admin', 'manager']);
    mockRequest.user!.roles = ['manager'];

    const result = guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(true);
  });

  it('should handle case-sensitive role matching', () => {
    mockGetAllAndOverride.mockReturnValue(['Admin']);
    mockRequest.user!.roles = ['admin'];

    const result = guard.canActivate(mockContext as ExecutionContext);

    expect(result).toBe(false);
  });

  it('should handle null context', () => {
    mockGetAllAndOverride.mockReturnValue(['admin']);

    expect(() =>
      guard.canActivate(null as unknown as ExecutionContext),
    ).toThrow();
  });

  it('should handle undefined context', () => {
    mockGetAllAndOverride.mockReturnValue(['admin']);

    expect(() =>
      guard.canActivate(undefined as unknown as ExecutionContext),
    ).toThrow();
  });

  it('should handle missing getHandler method', () => {
    mockGetAllAndOverride.mockReturnValue(['admin']);
    const contextWithoutHandler = { ...mockContext };
    delete contextWithoutHandler.getHandler;

    expect(() =>
      guard.canActivate(contextWithoutHandler as ExecutionContext),
    ).toThrow();
  });

  it('should handle missing getClass method', () => {
    mockGetAllAndOverride.mockReturnValue(['admin']);
    const contextWithoutClass = { ...mockContext };
    delete contextWithoutClass.getClass;

    expect(() =>
      guard.canActivate(contextWithoutClass as ExecutionContext),
    ).toThrow();
  });

  it('should handle missing switchToHttp method', () => {
    mockGetAllAndOverride.mockReturnValue(['admin']);
    const contextWithoutHttp = { ...mockContext };
    delete contextWithoutHttp.switchToHttp;

    expect(() =>
      guard.canActivate(contextWithoutHttp as ExecutionContext),
    ).toThrow();
  });

  it('should handle missing getRequest method', () => {
    mockGetAllAndOverride.mockReturnValue(['admin']);
    const contextWithEmptyHttp = {
      ...mockContext,
      switchToHttp: () => ({
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
    };

    expect(() =>
      guard.canActivate(contextWithEmptyHttp as ExecutionContext),
    ).toThrow();
  });
});
