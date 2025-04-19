import { Test, TestingModule } from '@nestjs/testing';
import { Invoice, InvoiceProps } from '../domain/invoice';
import { AddInvoiceUseCase } from '../usecases/add-invoice/add-invoice.usecase';
import { InvoiceController } from './invoice.controller';
import { InvoiceType } from '../utils/types';

const invoiceProps: InvoiceProps = {
  type: InvoiceType.HIPER,
  emited: new Date(),
  endDate: new Date(),
  total: 100.5,
  portions: 5,
};

describe('InvoiceController', () => {
  let invoiceController: InvoiceController;
  let addInvoiceUseCase: AddInvoiceUseCase;

  beforeEach(async () => {
    const invoice = Invoice.create(invoiceProps);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: AddInvoiceUseCase,
          useValue: {
            create: jest.fn().mockResolvedValue(invoice),
          },
        },
      ],
    }).compile();

    invoiceController = module.get<InvoiceController>(InvoiceController);
    addInvoiceUseCase = module.get<AddInvoiceUseCase>(AddInvoiceUseCase);
  });

  it('should be defined', () => {
    expect(invoiceController).toBeDefined();
    expect(addInvoiceUseCase).toBeDefined();
  });

  it('should create invoice', async () => {
    const dto = {
      type: InvoiceType.HIPER,
      emited: new Date(),
      endDate: new Date(),
      total: 100.5,
      portions: 5,
    };

    await invoiceController.create(dto);

    expect(addInvoiceUseCase.create).toHaveBeenCalledWith(dto);
  });
});
