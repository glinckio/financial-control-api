import { IsString, IsNumber, IsPositive, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'The name of the invoice',
    example: 'Monthly Subscription',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name!: string;

  @ApiProperty({
    description: 'The total value of the invoice',
    example: 1000.5,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  totalValue!: number;

  @ApiProperty({
    description: 'A detailed description of the invoice',
    example: 'Monthly subscription for premium services',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  description!: string;

  @ApiProperty({
    description: 'Number of bills/installments for this invoice',
    example: 3,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  numberOfBills!: number;
}
