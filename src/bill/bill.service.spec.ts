import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillService } from './bill.service';
import { Bill } from './entities/bill.entity';
import { InvoiceService } from '../invoice/invoice.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BillService', () => {
  let service: BillService;
  let billRepository: Repository<Bill>;

  const mockInvoice = {
    id: '1',
    name: 'Test Invoice',
    totalValue: 1000,
    numberOfBills: 10,
    description: 'Test Description',
    bills: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBill = {
    id: '1',
    value: 100,
    installmentNumber: 1,
    dueDate: new Date(),
    isPaid: false,
    invoice: mockInvoice,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBillRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((bill) => Promise.resolve({ ...bill, id: '1' })),
    find: jest.fn().mockResolvedValue([mockBill]),
    findOne: jest.fn().mockResolvedValue(mockBill),
    delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] }),
  };

  const mockInvoiceService = {
    findOne: jest.fn().mockResolvedValue(mockInvoice),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillService,
        {
          provide: getRepositoryToken(Bill),
          useValue: mockBillRepository,
        },
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    service = module.get<BillService>(BillService);
    billRepository = module.get<Repository<Bill>>(getRepositoryToken(Bill));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a bill', async () => {
      const createBillDto: CreateBillDto = {
        invoiceId: '1',
        installmentNumber: 1,
        dueDate: new Date(),
      };

      const result = await service.create(createBillDto);
      expect(result).toEqual({
        ...createBillDto,
        value: 100,
        id: '1',
        invoice: mockInvoice,
      });
      expect(billRepository.create).toHaveBeenCalled();
      expect(billRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if installment number exceeds total bills', async () => {
      const createBillDto: CreateBillDto = {
        invoiceId: '1',
        installmentNumber: 11,
        dueDate: new Date(),
      };

      await expect(service.create(createBillDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of bills', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockBill]);
      expect(billRepository.find).toHaveBeenCalledWith({
        relations: ['invoice'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single bill', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockBill);
      expect(billRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['invoice'],
      });
    });

    it('should throw NotFoundException if bill not found', async () => {
      jest.spyOn(billRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsPaid', () => {
    it('should mark a bill as paid', async () => {
      const result = await service.markAsPaid('1');
      expect(result.isPaid).toBe(true);
      expect(billRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a bill', async () => {
      await service.remove('1');
      expect(billRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if bill not found', async () => {
      jest.spyOn(billRepository, 'delete').mockResolvedValueOnce({
        affected: 0,
        raw: [],
      });
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
