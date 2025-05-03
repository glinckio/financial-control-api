import { IsString, IsNumber, IsPositive, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBillDto {
  @IsString()
  invoiceId!: string;

  @IsNumber()
  @IsPositive()
  installmentNumber!: number;

  @IsDate()
  @Type(() => Date)
  dueDate!: Date;
}
