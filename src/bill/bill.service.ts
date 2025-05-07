import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './entities/bill.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @Inject(forwardRef(() => InvoiceService))
    private readonly invoiceService: InvoiceService,
  ) {}

  async create(createBillDto: CreateBillDto): Promise<Bill> {
    const invoice = await this.invoiceService.findOne(createBillDto.invoiceId);

    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }

    if (createBillDto.installmentNumber > invoice.numberOfBills) {
      throw new BadRequestException(
        'Installment number exceeds total number of bills',
      );
    }

    const billValue = invoice.totalValue / invoice.numberOfBills;

    const bill = this.billRepository.create({
      ...createBillDto,
      value: billValue,
      invoice,
    });

    return await this.billRepository.save(bill);
  }

  async findAll(): Promise<Bill[]> {
    return await this.billRepository.find({
      relations: ['invoice'],
    });
  }

  async findOne(id: string): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: { id },
      relations: ['invoice'],
    });

    if (!bill) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }

    return bill;
  }

  async markAsPaid(id: string): Promise<Bill> {
    const bill = await this.findOne(id);
    bill.isPaid = true;
    return await this.billRepository.save(bill);
  }

  async remove(id: string): Promise<void> {
    const result = await this.billRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }
  }
}
