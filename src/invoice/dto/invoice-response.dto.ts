import { ApiProperty } from '@nestjs/swagger';

export class InvoiceResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the invoice',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'The name of the invoice',
    example: 'Monthly Subscription',
    minLength: 3,
  })
  name!: string;

  @ApiProperty({
    description: 'The total value of the invoice',
    example: 1000.5,
    minimum: 0,
  })
  totalValue!: number;

  @ApiProperty({
    description: 'A detailed description of the invoice',
    example: 'Monthly subscription for premium services',
    minLength: 3,
  })
  description!: string;

  @ApiProperty({
    description: 'Number of bills/installments for this invoice',
    example: 3,
    minimum: 1,
  })
  numberOfBills!: number;

  @ApiProperty({
    description: 'The creation date of the invoice',
    example: '2024-03-15T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'The last update date of the invoice',
    example: '2024-03-15T00:00:00.000Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'The status of the invoice',
    example: 'PENDING',
    enum: ['PENDING', 'PAID', 'CANCELLED'],
  })
  status!: string;
}

export class InvoiceErrorResponseDto {
  @ApiProperty({
    description: 'The HTTP status code',
    example: 400,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'The error message',
    example: 'Invalid invoice data',
  })
  message!: string;

  @ApiProperty({
    description: 'The error type',
    example: 'Bad Request',
  })
  error!: string;
}
