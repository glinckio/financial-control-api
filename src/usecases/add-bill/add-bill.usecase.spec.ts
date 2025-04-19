import { Decimal } from '@prisma/client/runtime/library';
import { BillRepositoryInterface } from '../../data/protocols/db/bill/bill-repository.interface';
import { Bill } from '../../domain/bill';
import { AddBillUseCase } from './add-bill.usecase';
import { BillTransformer } from '../../main/transformers/bill.transformer';

class MockBillRepository implements BillRepositoryInterface {
  async create(bill: Bill): Promise<any> {
    return Promise.resolve({
      id: 1,
      description: bill.description,
      amount: bill.amount,
      portion: bill.portion,
      purchasedDate: bill.purchasedDate,
      invoiceId: bill.invoiceId,
    });
  }
}

jest.mock('../../main/transformers/bill.transformer', () => ({
  BillTransformer: {
    toBill: jest.fn((billDb) => ({
      id: billDb.id,
      description: billDb.description,
      amount: billDb.amount,
      portion: billDb.portion,
      purchasedDate: billDb.purchasedDate,
      invoiceId: billDb.invoiceId,
    })),
  },
}));

describe('AddBill UseCase Unit Test', () => {
  let addBillUseCase: AddBillUseCase;
  let mockBillRepository: BillRepositoryInterface;

  beforeEach(() => {
    mockBillRepository = new MockBillRepository();
    addBillUseCase = new AddBillUseCase(mockBillRepository);
  });

  it('should create a bill successfully', async () => {
    const mockBill = Bill.create({
      description: 'Test Bill',
      amount: new Decimal(100.5),
      portion: 1,
      purchasedDate: new Date('2023-01-01'),
      invoiceId: 1,
    });

    const result = await addBillUseCase.create(mockBill);

    expect(result).toEqual({
      id: 1,
      description: 'Test Bill',
      amount: new Decimal(100.5),
      portion: 1,
      purchasedDate: expect.any(Date),
      invoiceId: 1,
    });

    expect(BillTransformer.toBill).toHaveBeenCalledWith({
      id: 1,
      description: 'Test Bill',
      amount: new Decimal(100.5),
      portion: 1,
      purchasedDate: expect.any(Date),
      invoiceId: 1,
    });
  });

  it('should throw an error if bill repository fails', async () => {
    const mockBill = Bill.create({
      description: 'Test Bill',
      amount: new Decimal(100.5),
      portion: 1,
      purchasedDate: new Date('2023-01-01'),
      invoiceId: 1,
    });

    jest
      .spyOn(mockBillRepository, 'create')
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(addBillUseCase.create(mockBill)).rejects.toThrow(
      'Database error',
    );
  });

  it('should call bill repository with correct parameters', async () => {
    const mockBill = Bill.create({
      description: 'Test Bill',
      amount: new Decimal(100.5),
      portion: 1,
      purchasedDate: new Date('2023-01-01'),
      invoiceId: 1,
    });

    const spy = jest.spyOn(mockBillRepository, 'create');

    await addBillUseCase.create(mockBill);

    expect(spy).toHaveBeenCalledWith(mockBill);
  });
});
