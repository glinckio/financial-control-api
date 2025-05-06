import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  InvoiceResponseDto,
  InvoiceErrorResponseDto,
} from './dto/invoice-response.dto';

@ApiTags('invoices')
@ApiBearerAuth()
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new invoice',
    description:
      'Creates a new invoice with the provided details and generates the corresponding bills.',
  })
  @ApiResponse({
    status: 201,
    description: 'The invoice has been successfully created.',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid invoice data.',
    type: InvoiceErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.',
    type: InvoiceErrorResponseDto,
  })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all invoices',
    description: 'Retrieves a list of all invoices with their details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all invoices.',
    type: [InvoiceResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.',
    type: InvoiceErrorResponseDto,
  })
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an invoice by id',
    description: 'Retrieves a specific invoice by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the invoice',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the invoice.',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found.',
    type: InvoiceErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.',
    type: InvoiceErrorResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an invoice',
    description: 'Deletes a specific invoice and its associated bills.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the invoice',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The invoice has been successfully deleted.',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found.',
    type: InvoiceErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.',
    type: InvoiceErrorResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }
}
