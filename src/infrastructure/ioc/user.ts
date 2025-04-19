import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AddUserUseCase } from '../../usecases/add-user/add-user.usecase';
import { UserRepositoryInterface } from 'src/data/protocols/db/user/user-repository.interface';
import { UserController } from '../../controllers/user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: AddUserUseCase,
      useFactory: (userRepository: UserRepositoryInterface) => {
        return new AddUserUseCase(userRepository);
      },
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
