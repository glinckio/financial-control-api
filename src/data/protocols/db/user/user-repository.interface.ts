import { User } from 'src/domain/user';
import { UserModel } from 'src/infrastructure/database/prisma/models/user.model';

export interface UserRepositoryInterface {
  create: (data: User) => Promise<UserModel>;
  find: () => Promise<UserModel[]>;
  findById: (id: number) => Promise<UserModel>;
  update: (id: number, dataUpdate: User) => Promise<UserModel>;
  remove: (id: number) => Promise<void>;
}
