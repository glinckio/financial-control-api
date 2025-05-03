import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

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

      const result = strategy.validate(payload);
      expect(result).toEqual({
        userId: '789',
        email: '',
      });
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
  });
});
