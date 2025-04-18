import { UserModel } from '../../infrastructure/database/prisma/models/user.model';
import { UserTranstormer } from '../../main/transformers/user.transformer';

describe('UserTransformer Unit test', () => {
  const mockUserModel: UserModel = {
    id: 1,
    name: 'any_name',
    surname: 'any_surname',
    email: 'any_email',
    password: 'any_password',
  };

  it('should transform single user model to user', () => {
    const result = UserTranstormer.toUser(mockUserModel);

    expect(result).toEqual({
      id: mockUserModel.id,
      name: mockUserModel.name,
      surname: mockUserModel.surname,
      email: mockUserModel.email,
      password: mockUserModel.password,
    });
  });

  it('should transform multiple user models to users', () => {
    const mockUserModels: UserModel[] = [
      mockUserModel,
      {
        ...mockUserModel,
        id: 2,
        name: 'other_name',
      },
    ];

    const result = UserTranstormer.toUsers(mockUserModels);

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      mockUserModels.map((user) => ({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: user.password,
      })),
    );
  });
});
