import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { User } from '../../database/entities/user.entity';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'password',
    name: 'Test User',
    roles: ['user'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when no roles are required', () => {
    const context = {
      getClass: () => ({}),
      getHandler: () => ({}),
      getArgs: () => [],
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(null);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return true when user has required role', () => {
    const context = {
      getClass: () => ({}),
      getHandler: () => ({}),
      getArgs: () => [],
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['user']);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return false when user does not have required role', () => {
    const context = {
      getClass: () => ({}),
      getHandler: () => ({}),
      getArgs: () => [],
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return false when user is not present in request', () => {
    const context = {
      getClass: () => ({}),
      getHandler: () => ({}),
      getArgs: () => [],
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({
          user: undefined,
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['user']);

    expect(guard.canActivate(context)).toBe(false);
  });
});
