import { UserRepositoryInterface } from 'src/data/protocols/db/user/user-repository.interface';
import { PrismaClient, User } from '@prisma/client';
import { UserProps } from 'src/domain/user';
import { UserModel } from '../../models/user.model';

export class PrismaUserRepository implements UserRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: UserProps): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async find(): Promise<UserModel[]> {
    return await this.prisma.user.findMany();
  }

  async findById(id: number): Promise<UserModel> {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: number, dataUpdate: User): Promise<UserModel> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: dataUpdate,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
