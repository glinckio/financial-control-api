import { AddUserUseCase } from './add-user.usecase';
import { UserRepositoryInterface } from '../../data/protocols/db/user/user-repository.interface';
import { User, UserProps } from '../../domain/user';
import { UserModel } from '../../infrastructure/database/prisma/models/user.model';
import { UserTranstormer } from '../../main/transformers/user.transformer';

jest.mock('../../main/transformers/user.transformer', () => ({
  UserTranstormer: {
    toUser: jest.fn((user) => ({ ...user })),
    toUsers: jest.fn((users) => users.map((user) => ({ ...user }))),
  },
}));

describe('AddUserUseCase', () => {
  let addUserUseCase: AddUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepositoryInterface>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
    } as any;
    addUserUseCase = new AddUserUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUserProps: UserProps = {
    name: 'Test',
    surname: 'User',
    email: 'test@example.com',
    password: 'password',
  };

  it('should call repository create method with correct user', async () => {
    const mockUser = User.create(mockUserProps);
    await addUserUseCase.create(mockUser);
    expect(mockUserRepository.create).toHaveBeenCalledWith(mockUser);
  });

  it('should return transformed user from repository', async () => {
    const mockUserModel: UserModel = {
      id: 1,
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      password: 'password',
    };
    mockUserRepository.create.mockResolvedValue(mockUserModel);

    const mockUser = User.create(mockUserProps);
    const result = await addUserUseCase.create(mockUser);

    expect(UserTranstormer.toUser).toHaveBeenCalledWith(mockUserModel);
    expect(result).toEqual({ ...mockUserModel });
  });

  it('should throw error if repository throws', async () => {
    const mockError = new Error('Database error');
    mockUserRepository.create.mockRejectedValue(mockError);

    const mockUser = User.create(mockUserProps);
    await expect(addUserUseCase.create(mockUser)).rejects.toThrow(
      'Database error',
    );
  });

  it('should create user with custom id if provided', async () => {
    const customId = 12345;
    const mockUser = User.create(mockUserProps, customId);
    await addUserUseCase.create(mockUser);
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ id: customId }),
    );
  });

  it('should update user properties correctly', async () => {
    const mockUser = User.create(mockUserProps);
    mockUser.updateName('New Name');
    mockUser.updateSurname('New Surname');
    mockUser.updateEmail('new@example.com');
    mockUser.updatePassword('newpassword');

    await addUserUseCase.create(mockUser);

    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        props: {
          name: 'New Name',
          surname: 'New Surname',
          email: 'new@example.com',
          password: 'newpassword',
        },
      }),
    );
  });

  it('should return correct JSON representation of user', () => {
    const mockUser = User.create(mockUserProps);
    const jsonUser = mockUser.toJSON();

    expect(jsonUser).toEqual({
      id: expect.any(Number),
      ...mockUserProps,
    });
  });

  const mockUserModel: UserModel = {
    id: 1,
    name: 'Test',
    surname: 'User',
    email: 'test@example.com',
    password: 'password',
  };

  it('should transform a single user correctly', () => {
    const result = UserTranstormer.toUser(mockUserModel);
    expect(result).toEqual(mockUserModel);
  });

  it('should transform multiple users correctly', () => {
    const mockUserModels: UserModel[] = [
      mockUserModel,
      { ...mockUserModel, id: 2, name: 'Test2' },
    ];
    const result = UserTranstormer.toUsers(mockUserModels);
    expect(result).toEqual(mockUserModels);
  });

  it('should handle empty array in toUsers', () => {
    const result = UserTranstormer.toUsers([]);
    expect(result).toEqual([]);
  });
});
