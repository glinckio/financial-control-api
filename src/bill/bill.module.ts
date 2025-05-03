import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { Bill } from './entities/bill.entity';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bill]), forwardRef(() => InvoiceModule)],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
