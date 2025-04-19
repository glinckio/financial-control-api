import { InvoiceTransformer } from '../../main/transformers/invoice.transformer';
import { InvoiceModel } from '../../infrastructure/database/prisma/models/invoice.model';
import { InvoiceType } from '../../utils/types';
import { AddInvoiceUseCase } from './add-invoice.usecase';
import { InvoiceRepositoryInterface } from '../../data/protocols/db/invoice/invoice-repository.interface';
import { BillRepositoryInterface } from '../../data/protocols/db/bill/bill-repository.interface';
import { Invoice, InvoiceProps } from '../../domain/invoice';

const now = new Date();
const mockInvoiceModel: InvoiceModel = {
  id: 1,
  type: InvoiceType.HIPER,
  emited: now,
  endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
  total: 100.5,
  portions: 5,
};

const expectedTransformedInvoice = {
  id: mockInvoiceModel.id,
  type: mockInvoiceModel.type,
  emited: mockInvoiceModel.emited,
  endDate: mockInvoiceModel.endDate,
  total: mockInvoiceModel.total,
};

describe('AddInvoice UseCase Unit test', () => {
  let addInvoiceUseCase: AddInvoiceUseCase;
  let mockInvoiceRepository: jest.Mocked<InvoiceRepositoryInterface>;
  let mockBillRepository: jest.Mocked<BillRepositoryInterface>;

  beforeEach(() => {
    mockInvoiceRepository = {
      create: jest.fn(),
    } as any;

    mockBillRepository = {
      create: jest.fn(),
    } as any;

    addInvoiceUseCase = new AddInvoiceUseCase(
      mockInvoiceRepository,
      mockBillRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockInvoiceProps: InvoiceProps = {
    type: InvoiceType.HIPER,
    emited: now,
    endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    total: 100.5,
    portions: 5,
  };

  it('should call repository create method with correct invoice', async () => {
    const mockInvoice = Invoice.create(mockInvoiceProps);

    mockInvoiceRepository.create.mockResolvedValue({
      id: 1,
      ...mockInvoiceProps,
    });

    await addInvoiceUseCase.create(mockInvoice);

    expect(mockInvoiceRepository.create).toHaveBeenCalledWith(mockInvoice);
    expect(mockBillRepository.create).toHaveBeenCalledTimes(5);
  });

  it('should transform a single invoice model correctly', () => {
    const result = InvoiceTransformer.toInvoice(mockInvoiceModel);
    expect(result).toEqual(expectedTransformedInvoice);
  });

  it('should transform single invoice model to invoice', () => {
    const result = InvoiceTransformer.toInvoice(mockInvoiceModel);

    expect(result).toEqual({
      id: mockInvoiceModel.id,
      type: mockInvoiceModel.type,
      emited: mockInvoiceModel.emited,
      endDate: mockInvoiceModel.endDate,
      total: mockInvoiceModel.total,
    });
  });

  it('should transform an array of invoice models correctly', () => {
    const mockInvoiceModels = [
      mockInvoiceModel,
      { ...mockInvoiceModel, id: 2 },
      { ...mockInvoiceModel, id: 3 },
    ];

    const result = InvoiceTransformer.toInvoices(mockInvoiceModels);

    expect(result).toEqual([
      expectedTransformedInvoice,
      { ...expectedTransformedInvoice, id: 2 },
      { ...expectedTransformedInvoice, id: 3 },
    ]);
  });

  it('should handle empty array correctly', () => {
    const result = InvoiceTransformer.toInvoices([]);
    expect(result).toEqual([]);
  });

  it('should handle single item array correctly', () => {
    const result = InvoiceTransformer.toInvoices([mockInvoiceModel]);
    expect(result).toEqual([expectedTransformedInvoice]);
  });
});
