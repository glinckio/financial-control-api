import { ApiProperty } from '@nestjs/swagger';

export class BillResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the bill',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'The ID of the associated invoice',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  invoiceId!: string;

  @ApiProperty({
    description: 'The installment number of this bill',
    example: 1,
    minimum: 1,
  })
  installmentNumber!: number;

  @ApiProperty({
    description: 'The due date for this bill',
    example: '2024-03-15T00:00:00.000Z',
  })
  dueDate!: Date;

  @ApiProperty({
    description: 'The value of this bill installment',
    example: 333.5,
    minimum: 0,
  })
  value!: number;

  @ApiProperty({
    description: 'The status of the bill',
    example: 'PENDING',
    enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
  })
  status!: string;

  @ApiProperty({
    description: 'The payment date of the bill (if paid)',
    example: '2024-03-15T00:00:00.000Z',
    nullable: true,
  })
  paidAt!: Date | null;

  @ApiProperty({
    description: 'The creation date of the bill',
    example: '2024-03-15T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'The last update date of the bill',
    example: '2024-03-15T00:00:00.000Z',
  })
  updatedAt!: Date;
}

export class BillErrorResponseDto {
  @ApiProperty({
    description: 'The HTTP status code',
    example: 400,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'The error message',
    example: 'Invalid bill data',
  })
  message!: string;

  @ApiProperty({
    description: 'The error type',
    example: 'Bad Request',
  })
  error!: string;
}
