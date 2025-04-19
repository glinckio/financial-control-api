import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AddInvoiceUseCase } from '../../usecases/add-invoice/add-invoice.usecase';
import { InvoiceRepositoryInterface } from '../../data/protocols/db/invoice/invoice-repository.interface';
import { InvoiceController } from 'src/controllers/invoice.controller';
import { BillRepositoryInterface } from 'src/data/protocols/db/bill/bill-repository.interface';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: AddInvoiceUseCase,
      useFactory: (
        invoiceRepository: InvoiceRepositoryInterface,
        billRepository: BillRepositoryInterface,
      ) => {
        return new AddInvoiceUseCase(invoiceRepository, billRepository);
      },
    },
  ],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
