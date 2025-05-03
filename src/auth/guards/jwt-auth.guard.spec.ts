import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';

jest.mock('@nestjs/passport', () => {
  return {
    AuthGuard: jest.fn().mockImplementation(() => {
      return class {
        canActivate(context: ExecutionContext): boolean {
          const request = context.switchToHttp().getRequest<MockRequest>();
          const authHeader = request.headers?.authorization;
          const token = authHeader?.split(' ')[1];

          if (!token) {
            throw new Error('No token provided');
          }

          if (token === 'invalid-token') {
            throw new Error('Invalid token');
          }

          return true;
        }

        logIn(): Promise<void> {
          return Promise.resolve();
        }

        handleRequest<TUser>(_err: unknown, user: TUser): TUser {
          return user;
        }

        getAuthenticateOptions(): undefined {
          return undefined;
        }

        getRequest(context: ExecutionContext): Request {
          return context.switchToHttp().getRequest();
        }
      };
    }),
  };
});

interface MockRequest extends Partial<Request> {
  headers: {
    authorization?: string;
  };
}

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  const mockExecutionContext = createMock<ExecutionContext>();
  const mockRequest: MockRequest = {
    headers: {
      authorization: 'Bearer valid-token',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);

    mockExecutionContext.switchToHttp.mockReturnValue({
      getRequest: () => mockRequest,
    } as any);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for public routes', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('should authenticate non-public routes with valid token', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw error for non-public routes with missing token', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockRequest.headers.authorization = undefined;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'No token provided',
      );
    });

    it('should throw error for non-public routes with invalid token', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockRequest.headers.authorization = 'Bearer invalid-token';

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Invalid token',
      );
    });

    it('should throw error for non-public routes with malformed token', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockRequest.headers.authorization = 'invalid-format';

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'No token provided',
      );
    });
  });
});
