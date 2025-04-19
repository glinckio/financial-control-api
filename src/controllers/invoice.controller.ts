import { Body, Controller, Post } from '@nestjs/common';
import { AddInvoiceUseCase } from '../usecases/add-invoice/add-invoice.usecase';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly addInvoiceUseCase: AddInvoiceUseCase) {}

  @Post()
  async create(@Body() data: any) {
    return await this.addInvoiceUseCase.create(data);
  }
}
