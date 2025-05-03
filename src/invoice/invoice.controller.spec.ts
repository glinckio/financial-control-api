import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  const mockInvoice = {
    id: '1',
    name: 'Test Invoice',
    totalValue: 1000,
    description: 'Test Description',
    numberOfBills: 10,
    bills: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockInvoiceService = {
    create: jest.fn().mockResolvedValue(mockInvoice),
    findAll: jest.fn().mockResolvedValue([mockInvoice]),
    findOne: jest.fn().mockResolvedValue(mockInvoice),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        name: 'Test Invoice',
        totalValue: 1000,
        description: 'Test Description',
        numberOfBills: 10,
      };

      const result = await controller.create(createInvoiceDto);
      expect(result).toEqual(mockInvoice);
      expect(service.create).toHaveBeenCalledWith(createInvoiceDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockInvoice]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single invoice', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockInvoice);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('remove', () => {
    it('should remove an invoice', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
