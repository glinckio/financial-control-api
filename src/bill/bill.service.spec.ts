import { Test, TestingModule } from '@nestjs/testing';
import { BillService } from './bill.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InvoiceService } from '../invoice/invoice.service';

describe('BillService', () => {
  let service: BillService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  const mockInvoiceService = {
    findOne: jest.fn(),
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
    it('should create a bill successfully', async () => {
      const createBillDto: CreateBillDto = {
        value: 100,
        installmentNumber: 1,
        dueDate: new Date(),
        invoiceId: '1',
      };

      const mockInvoice = {
        id: '1',
        numberOfBills: 10,
        totalValue: 1000,
      };

      const mockBill = {
        id: '1',
        value: mockInvoice.totalValue / mockInvoice.numberOfBills,
        installmentNumber: 1,
        dueDate: createBillDto.dueDate,
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockInvoiceService.findOne.mockResolvedValue(mockInvoice);
      mockRepository.create.mockReturnValue(mockBill);
      mockRepository.save.mockResolvedValue(mockBill);

      const result = await service.create(createBillDto);

      expect(result).toEqual(mockBill);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createBillDto,
        value: mockInvoice.totalValue / mockInvoice.numberOfBills,
        invoice: mockInvoice,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockBill);
    });

    it('should throw BadRequestException when invoice is not found', async () => {
      const createBillDto: CreateBillDto = {
        value: 100,
        installmentNumber: 1,
        dueDate: new Date(),
        invoiceId: '1',
      };

      mockInvoiceService.findOne.mockResolvedValue(null);

      await expect(service.create(createBillDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of bills', async () => {
      const mockBills = [
        {
          id: '1',
          value: 100,
          installmentNumber: 1,
          dueDate: new Date(),
          isPaid: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(mockBills);

      const result = await service.findAll();

      expect(result).toEqual(mockBills);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a bill by id', async () => {
      const mockBill = {
        id: '1',
        value: 100,
        installmentNumber: 1,
        dueDate: new Date(),
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockBill);

      const result = await service.findOne('1');

      expect(result).toEqual(mockBill);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['invoice'],
      });
    });

    it('should throw NotFoundException when bill is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsPaid', () => {
    it('should mark a bill as paid', async () => {
      const mockBill = {
        id: '1',
        value: 100,
        installmentNumber: 1,
        dueDate: new Date(),
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockBill);
      mockRepository.save.mockResolvedValue({ ...mockBill, isPaid: true });

      const result = await service.markAsPaid('1');

      expect(result.isPaid).toBe(true);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when bill is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.markAsPaid('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a bill', async () => {
      const mockBill = {
        id: '1',
        value: 100,
        installmentNumber: 1,
        dueDate: new Date(),
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockBill);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when bill is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
