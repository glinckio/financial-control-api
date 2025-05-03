import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { InvoiceService } from './invoice.service';
import { Invoice } from './entities/invoice.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { BillService } from '../bill/bill.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let repository: Repository<Invoice>;

  const mockInvoice = {
    id: '1',
    name: 'Test Invoice',
    number: 'INV-202505-4402',
    totalValue: 1000,
    description: 'Test Description',
    numberOfBills: 10,
    bills: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((dto: CreateInvoiceDto) => dto),
    save: jest
      .fn()
      .mockImplementation((invoice: Invoice) =>
        Promise.resolve({ ...invoice, id: '1' }),
      ),
    find: jest.fn().mockResolvedValue([mockInvoice]),
    findOne: jest.fn().mockResolvedValue(mockInvoice),
    delete: jest
      .fn()
      .mockResolvedValue({ affected: 1, raw: [] } as DeleteResult),
  };

  const mockBillService = {
    create: jest.fn().mockResolvedValue({
      id: '1',
      value: 100,
      installmentNumber: 1,
      dueDate: new Date(),
      isPaid: false,
      invoice: mockInvoice,
    }),
  };

  beforeEach(async () => {
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
    repository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice and its bills', async () => {
      const createInvoiceDto = {
        name: 'Test Invoice',
        totalValue: 1000,
        description: 'Test Description',
        numberOfBills: 10,
      };

      const result = await service.create(createInvoiceDto);
      expect(result).toEqual(mockInvoice);
      expect(repository.create).toHaveBeenCalledWith({
        ...createInvoiceDto,
        number: expect.stringMatching(/^INV-\d{6}-\d{4}$/),
      });
      expect(repository.save).toHaveBeenCalled();
      expect(mockBillService.create).toHaveBeenCalledTimes(10);
    });

    it('should throw BadRequestException if numberOfBills is less than 1', async () => {
      const createInvoiceDto = {
        name: 'Test Invoice',
        totalValue: 1000,
        description: 'Test Description',
        numberOfBills: 0,
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new BadRequestException('Number of bills must be greater than 0'),
        );

      await expect(service.create(createInvoiceDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if totalValue is less than or equal to 0', async () => {
      const createInvoiceDto = {
        name: 'Test Invoice',
        totalValue: 0,
        description: 'Test Description',
        numberOfBills: 10,
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new BadRequestException('Total value must be greater than 0'),
        );

      await expect(service.create(createInvoiceDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle bill creation failure', async () => {
      const createInvoiceDto = {
        name: 'Test Invoice',
        totalValue: 1000,
        description: 'Test Description',
        numberOfBills: 10,
      };

      mockBillService.create.mockRejectedValueOnce(
        new Error('Bill creation failed'),
      );

      await expect(service.create(createInvoiceDto)).rejects.toThrow(
        'Bill creation failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockInvoice]);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['bills'],
      });
    });

    it('should return empty array when no invoices exist', async () => {
      mockRepository.find.mockResolvedValueOnce([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockRepository.find.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a single invoice', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockInvoice);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['bills'],
      });
    });

    it('should throw NotFoundException if invoice not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors', async () => {
      mockRepository.findOne.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.findOne('1')).rejects.toThrow('Database error');
    });
  });

  describe('remove', () => {
    it('should remove an invoice', async () => {
      await service.remove('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if invoice not found', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValueOnce({ affected: 0, raw: [] } as DeleteResult);
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors', async () => {
      mockRepository.delete.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.remove('1')).rejects.toThrow('Database error');
    });
  });
});
