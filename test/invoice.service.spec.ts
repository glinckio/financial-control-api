import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceService } from '../src/invoice/invoice.service';
import { Invoice } from '../src/invoice/entities/invoice.entity';
import { BillService } from '../src/bill/bill.service';
import { NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from '../src/invoice/dto/create-invoice.dto';

describe('InvoiceService', () => {
  let service: InvoiceService;

  const mockInvoice: Invoice = {
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

  const mockBillService = {
    create: jest.fn().mockResolvedValue({}),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockInvoice),
    save: jest.fn().mockResolvedValue(mockInvoice),
    find: jest.fn().mockResolvedValue([mockInvoice]),
    findOne: jest.fn().mockResolvedValue(mockInvoice),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockRepository,
        },
        {
          provide: BillService,
          useValue: mockBillService,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateInvoiceDto = {
      name: 'Test Invoice',
      totalValue: 1000,
      description: 'Test Description',
      numberOfBills: 3,
    };

    it('should create an invoice and its bills', async () => {
      const result = await service.create(createDto);

      expect(result).toEqual(mockInvoice);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        number: expect.stringMatching(/^INV-\d{6}-\d{4}$/),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockInvoice);
      expect(mockBillService.create).toHaveBeenCalledTimes(3);
    });

    it('should generate unique invoice numbers', async () => {
      const invoiceNumbers = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const result = await service.create(createDto);
        expect(result.number).toMatch(/^INV-\d{6}-\d{4}$/);
        invoiceNumbers.add(result.number);
      }
      expect(invoiceNumbers.size).toBe(100);
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices with bills', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockInvoice]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['bills'],
      });
    });
  });

  describe('findOne', () => {
    it('should return an invoice if found', async () => {
      const result = await service.findOne('1');

      expect(result).toEqual(mockInvoice);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['bills'],
      });
    });

    it('should throw NotFoundException if invoice not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne('1')).rejects.toThrow(
        new NotFoundException('Invoice with ID 1 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove an invoice if found', async () => {
      await service.remove('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if invoice not found', async () => {
      mockRepository.delete.mockResolvedValueOnce({ affected: 0 });

      await expect(service.remove('1')).rejects.toThrow(
        new NotFoundException('Invoice with ID 1 not found'),
      );
    });
  });
});
