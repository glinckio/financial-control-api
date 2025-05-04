import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('constructor', () => {
    it('should configure strategy with correct options', () => {
      const getSpy = jest.spyOn(configService, 'get');
      expect(getSpy).toHaveBeenCalledWith('JWT_SECRET');
      expect(strategy).toBeDefined();
    });

    it('should throw UnauthorizedException when JWT_SECRET is not defined', () => {
      const configServiceWithoutSecret = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as ConfigService;

      expect(() => new JwtStrategy(configServiceWithoutSecret)).toThrow(
        UnauthorizedException,
      );
      expect(() => new JwtStrategy(configServiceWithoutSecret)).toThrow(
        'JWT_SECRET is not defined',
      );
    });

    it('should throw UnauthorizedException when JWT_SECRET is empty', () => {
      const configServiceWithEmptySecret = {
        get: jest.fn().mockReturnValue(''),
      } as unknown as ConfigService;

      expect(() => new JwtStrategy(configServiceWithEmptySecret)).toThrow(
        UnauthorizedException,
      );
      expect(() => new JwtStrategy(configServiceWithEmptySecret)).toThrow(
        'JWT_SECRET is not defined',
      );
    });
  });

  describe('validate', () => {
    it('should return user data from payload', () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
      };

      const result = strategy.validate(payload);
      expect(result).toEqual({
        userId: '123',
        email: 'test@example.com',
      });
    });

    it('should handle payload with different user ID', () => {
      const payload = {
        sub: '456',
        email: 'another@example.com',
      };

      const result = strategy.validate(payload);
      expect(result).toEqual({
        userId: '456',
        email: 'another@example.com',
      });
    });

    it('should handle payload with empty email', () => {
      const payload = {
        sub: '789',
        email: '',
      };

      expect(() => strategy.validate(payload)).toThrow(
        'Invalid payload: email is required',
      );
    });

    it('should handle payload with special characters in email', () => {
      const payload = {
        sub: 'abc',
        email: 'user+test@example.com',
      };

      const result = strategy.validate(payload);
      expect(result).toEqual({
        userId: 'abc',
        email: 'user+test@example.com',
      });
    });

    it('should handle payload with additional fields', () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['admin'],
      };

      const result = strategy.validate(payload as any);
      expect(result).toEqual({
        userId: '123',
        email: 'test@example.com',
      });
    });

    it('should throw error when sub is missing', () => {
      const payload = {
        email: 'test@example.com',
      };

      expect(() => strategy.validate(payload as any)).toThrow(
        'Invalid payload: sub is required',
      );
    });

    it('should throw error when email is missing', () => {
      const payload = {
        sub: '123',
      };

      expect(() => strategy.validate(payload as any)).toThrow(
        'Invalid payload: email is required',
      );
    });

    it('should throw error when payload is null', () => {
      expect(() => strategy.validate(null as any)).toThrow(
        'Invalid payload: payload is required',
      );
    });

    it('should throw error when payload is undefined', () => {
      expect(() => strategy.validate(undefined as any)).toThrow(
        'Invalid payload: payload is required',
      );
    });
  });
});
