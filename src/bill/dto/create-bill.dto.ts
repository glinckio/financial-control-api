import { IsString, IsNumber, IsPositive, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillDto {
  @ApiProperty({
    description: 'The ID of the associated invoice',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  invoiceId!: string;

  @ApiProperty({
    description: 'The installment number of this bill',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  installmentNumber!: number;

  @ApiProperty({
    description: 'The due date for this bill',
    example: '2024-03-15T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  dueDate!: Date;
}
