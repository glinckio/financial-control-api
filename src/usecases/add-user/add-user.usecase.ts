import { UserRepositoryInterface } from '../../data/protocols/db/user/user-repository.interface';
import { User } from '../../domain/user';
import { UserTranstormer } from '../../main/transformers/user.transformer';

export class AddUserUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async create(user: User) {
    const userDb = await this.userRepository.create(user);
    return UserTranstormer.toUser(userDb);
  }
}
