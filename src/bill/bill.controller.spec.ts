import { Test, TestingModule } from '@nestjs/testing';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('BillController', () => {
  let controller: BillController;
  let service: BillService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    markAsPaid: jest.fn(),
    remove: jest.fn(),
  };

  const mockBill = {
    id: '1',
    value: 100,
    installmentNumber: 1,
    dueDate: new Date(),
    isPaid: false,
    invoice: {
      id: '1',
      name: 'Test Invoice',
      number: 'INV-202505-4402',
      totalValue: 1000,
      description: 'Test Description',
      numberOfBills: 10,
      bills: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillController],
      providers: [
        {
          provide: BillService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BillController>(BillController);
    service = module.get<BillService>(BillService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a bill', async () => {
      const createBillDto: CreateBillDto = {
        invoiceId: '1',
        installmentNumber: 1,
        dueDate: new Date(),
        value: 100,
      };

      mockService.create.mockResolvedValue(mockBill);

      const result = await controller.create(createBillDto);
      expect(result).toEqual(mockBill);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.create).toHaveBeenCalledWith(createBillDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of bills', async () => {
      mockService.findAll.mockResolvedValue([mockBill]);

      const result = await controller.findAll();
      expect(result).toEqual([mockBill]);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single bill', async () => {
      mockService.findOne.mockResolvedValue(mockBill);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockBill);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('markAsPaid', () => {
    it('should mark a bill as paid', async () => {
      const paidBill = { ...mockBill, isPaid: true };
      mockService.markAsPaid.mockResolvedValue(paidBill);

      const result = await controller.markAsPaid('1');
      expect(result).toEqual(paidBill);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.markAsPaid).toHaveBeenCalledWith('1');
    });
  });

  describe('remove', () => {
    it('should remove a bill', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
