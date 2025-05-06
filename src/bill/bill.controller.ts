import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { BillResponseDto, BillErrorResponseDto } from './dto/bill-response.dto';

@ApiTags('bills')
@ApiBearerAuth()
@Controller('bills')
@UseGuards(JwtAuthGuard)
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new bill',
    description: 'Creates a new bill for an existing invoice.',
  })
  @ApiResponse({
    status: 201,
    description: 'The bill has been successfully created.',
    type: BillResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid bill data.',
    type: BillErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.',
    type: BillErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found.',
    type: BillErrorResponseDto,
  })
  create(@Body() createBillDto: CreateBillDto) {
    return this.billService.create(createBillDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all bills',
    description: 'Retrieves a list of all bills with their details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all bills.',
    type: [BillResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.',
    type: BillErrorResponseDto,
  })
  findAll() {
    return this.billService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a bill by id',
    description: 'Retrieves a specific bill by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the bill',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the bill.',
    type: BillResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Bill not found.',
    type: BillErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.',
    type: BillErrorResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.billService.findOne(id);
  }

  @Patch(':id/mark-as-paid')
  @ApiOperation({
    summary: 'Mark a bill as paid',
    description:
      'Updates the status of a bill to paid and records the payment date.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the bill',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The bill has been successfully marked as paid.',
    type: BillResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Bill not found.',
    type: BillErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Bill is already paid.',
    type: BillErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.',
    type: BillErrorResponseDto,
  })
  markAsPaid(@Param('id') id: string) {
    return this.billService.markAsPaid(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a bill',
    description: 'Deletes a specific bill. Note: Cannot delete paid bills.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the bill',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The bill has been successfully deleted.',
    type: BillResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Bill not found.',
    type: BillErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot delete paid bills.',
    type: BillErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.',
    type: BillErrorResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.billService.remove(id);
  }
}
