import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BillService } from '../src/bill/bill.service';
import { Bill } from '../src/bill/entities/bill.entity';
import { InvoiceService } from '../src/invoice/invoice.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBillDto } from '../src/bill/dto/create-bill.dto';

describe('BillService', () => {
  let service: BillService;

  const mockInvoice = {
    id: '1',
    name: 'Test Invoice',
    number: 'INV-202401-0001',
    totalValue: 1000,
    description: 'Test Description',
    numberOfBills: 3,
    bills: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBill = {
    id: '1',
    installmentNumber: 1,
    value: 333.33,
    dueDate: new Date(),
    isPaid: false,
    invoice: mockInvoice,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockInvoiceService = {
    findOne: jest.fn().mockResolvedValue(mockInvoice),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockBill),
    save: jest.fn().mockResolvedValue(mockBill),
    find: jest.fn().mockResolvedValue([mockBill]),
    findOne: jest.fn().mockResolvedValue(mockBill),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillService,
        {
          provide: getRepositoryToken(Bill),
          useValue: mockRepository,
        },
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    service = module.get<BillService>(BillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a bill with correct value', async () => {
      const createDto: CreateBillDto = {
        invoiceId: '1',
        installmentNumber: 1,
        dueDate: new Date(),
      };

      const result = await service.create(createDto);

      expect(result).toEqual(mockBill);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        value: mockInvoice.totalValue / mockInvoice.numberOfBills,
        invoice: mockInvoice,
      });
    });

    it('should throw BadRequestException if installment number exceeds total bills', async () => {
      const createDto: CreateBillDto = {
        invoiceId: '1',
        installmentNumber: 4,
        dueDate: new Date(),
      };

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of bills with invoice', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockBill]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['invoice'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a bill if found', async () => {
      const result = await service.findOne('1');

      expect(result).toEqual(mockBill);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['invoice'],
      });
    });

    it('should throw NotFoundException if bill not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsPaid', () => {
    it('should mark a bill as paid', async () => {
      const result = await service.markAsPaid('1');

      expect(result).toEqual({ ...mockBill, isPaid: true });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockBill,
        isPaid: true,
      });
    });

    it('should throw NotFoundException if bill not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.markAsPaid('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a bill if found', async () => {
      await service.remove('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if bill not found', async () => {
      mockRepository.delete.mockResolvedValueOnce({ affected: 0 });

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
