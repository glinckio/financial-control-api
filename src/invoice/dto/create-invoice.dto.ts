import { IsString, IsNumber, IsPositive, MinLength } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsNumber()
  @IsPositive()
  totalValue!: number;

  @IsString()
  @MinLength(3)
  description!: string;

  @IsNumber()
  @IsPositive()
  numberOfBills!: number;
}
