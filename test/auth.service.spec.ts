import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/database/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { ROLES } from '../src/common/constants/app.constants';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    roles: [ROLES.ADMIN],
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('test.jwt.token'),
  };

  const mockRepository = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        identifiers: [{ id: '1' }],
      }),
    })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    beforeEach(() => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => 'hashedPassword' as never);
    });

    it('should register a new user and return access token', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.register(registerDto);

      expect(result).toEqual({ access_token: 'test.jwt.token' });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: '1',
        email: registerDto.email,
      });
    });

    it('should throw UnauthorizedException if email already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        new UnauthorizedException('Email already exists'),
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    beforeEach(() => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true as never);
    });

    it('should login user and return access token', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: 'test.jwt.token' });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false as never);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });
});
