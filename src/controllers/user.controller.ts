import { Body, Controller, Post } from '@nestjs/common';
import { AddUserUseCase } from '../usecases/add-user/add-user.usecase';

@Controller('users')
export class UserController {
  constructor(private readonly addUserUseCase: AddUserUseCase) {}

  @Post()
  async create(@Body() data: any) {
    return await this.addUserUseCase.create(data);
  }
}
