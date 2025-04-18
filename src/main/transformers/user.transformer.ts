import { UserModel } from 'src/infrastructure/database/prisma/models/user.model';

export class UserTranstormer {
  static toUser = (user: UserModel) => ({
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    password: user.password,
  });

  static toUsers(users: UserModel[]) {
    return users.map(this.toUser);
  }
}
