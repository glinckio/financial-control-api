import { User, UserProps } from '../../../../../domain/user';
import { PrismaUserRepository } from './prisma-user-repository';

const userProps: UserProps = {
  name: 'any_name',
  surname: 'any_surname',
  email: 'any_email',
  password: 'any_password',
};

const mockPrismaClient = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));

describe('PrismaUserRepository Unit Test', () => {
  let prismaUserRepository: PrismaUserRepository;

  beforeEach(() => {
    prismaUserRepository = new PrismaUserRepository();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(prismaUserRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = User.create(userProps);
      const expectedCreatedUser = {
        ...user,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaClient.user.create.mockResolvedValue(expectedCreatedUser);

      const result = await prismaUserRepository.create(user);

      expect(result).toEqual(expectedCreatedUser);
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: user,
      });
    });

    it('should throw if prisma create fails', async () => {
      const user = User.create(userProps);
      mockPrismaClient.user.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(prismaUserRepository.create(user)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('find', () => {
    it('should find an array of users', async () => {
      const mockUsers = [
        { id: 1, ...userProps, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, ...userProps, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);

      const result = await prismaUserRepository.find();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaClient.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const mockUser = {
        id: 1,
        ...userProps,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaClient.user.findUniqueOrThrow.mockResolvedValue(mockUser);

      const result = await prismaUserRepository.findById(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaClient.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw if user is not found', async () => {
      mockPrismaClient.user.findUniqueOrThrow.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(prismaUserRepository.findById(999)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { ...userProps, name: 'updated_name' };
      const mockUpdatedUser = {
        id: 1,
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaClient.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await prismaUserRepository.update(1, updateData as any);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });

    it('should throw if update fails', async () => {
      mockPrismaClient.user.update.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(
        prismaUserRepository.update(1, userProps as any),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      await prismaUserRepository.remove(1);

      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw if delete fails', async () => {
      mockPrismaClient.user.delete.mockRejectedValue(
        new Error('Delete failed'),
      );

      await expect(prismaUserRepository.remove(1)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
