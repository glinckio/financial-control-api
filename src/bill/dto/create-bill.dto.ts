import { IsNumber, IsDate, IsUUID } from 'class-validator';

export class CreateBillDto {
  @IsNumber()
  value: number = 0;

  @IsNumber()
  installmentNumber: number = 1;

  @IsDate()
  dueDate: Date = new Date();

  @IsUUID()
  invoiceId: string = '';
}
