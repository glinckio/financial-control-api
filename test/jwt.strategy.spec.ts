import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

interface JwtPayload {
  sub: string;
  email: string;
}

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should throw UnauthorizedException when JWT_SECRET is not defined', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    expect(() => new JwtStrategy(configService)).toThrow(
      new UnauthorizedException('JWT_SECRET is not defined'),
    );
  });

  it('should throw UnauthorizedException when JWT_SECRET is empty string', () => {
    jest.spyOn(configService, 'get').mockReturnValue('');

    expect(() => new JwtStrategy(configService)).toThrow(
      new UnauthorizedException('JWT_SECRET is not defined'),
    );
  });

  it('should initialize with valid JWT_SECRET', () => {
    const secret = 'test-secret';
    jest.spyOn(configService, 'get').mockReturnValue(secret);

    const newStrategy = new JwtStrategy(configService);
    expect(newStrategy).toBeDefined();
  });

  it('should validate payload and return user data', () => {
    const payload: JwtPayload = {
      sub: '123',
      email: 'test@example.com',
    };

    const result = strategy.validate(payload);

    expect(result).toEqual({
      userId: '123',
      email: 'test@example.com',
    });
  });

  it('should handle payload with different data', () => {
    const payload: JwtPayload = {
      sub: '456',
      email: 'another@example.com',
    };

    const result = strategy.validate(payload);

    expect(result).toEqual({
      userId: '456',
      email: 'another@example.com',
    });
  });

  it('should handle payload with additional fields', () => {
    const payload = {
      sub: '789',
      email: 'extra@example.com',
      extraField: 'extra value',
      roles: ['admin'],
    } as JwtPayload;

    const result = strategy.validate(payload);

    expect(result).toEqual({
      userId: '789',
      email: 'extra@example.com',
    });
  });

  it('should throw error when payload is missing required fields', () => {
    const payload = {
      email: 'missing-sub@example.com',
    } as JwtPayload;

    expect(() => strategy.validate(payload)).toThrow();
  });

  it('should throw error when payload is null', () => {
    expect(() => strategy.validate(null as unknown as JwtPayload)).toThrow();
  });

  it('should throw error when payload is undefined', () => {
    expect(() =>
      strategy.validate(undefined as unknown as JwtPayload),
    ).toThrow();
  });
});
