import { Bill, BillProps } from './bill';
import { Decimal } from '@prisma/client/runtime/library';

describe('Bill Unit Tests', () => {
  const mockDate = new Date('2023-01-01');

  const createDefaultBillProps = (): BillProps => ({
    description: 'Test Bill',
    amount: new Decimal(100.5),
    portion: 1,
    purchasedDate: mockDate,
    invoiceId: 1,
  });

  it('should create a Bill instance', () => {
    const billProps = createDefaultBillProps();
    let bill = Bill.create(billProps);

    expect(bill.props).toEqual({
      ...billProps,
    });
    expect(bill.id).toBeDefined();

    bill = Bill.create(billProps, 123);
    expect(bill.id).toBe(123);
    expect(bill.props).toEqual({
      ...billProps,
    });
  });

  it('should update description', () => {
    const bill = Bill.create(createDefaultBillProps());
    const newDescription = 'Updated Description';

    bill.updateDescription(newDescription);

    expect(bill.description).toBe(newDescription);
  });

  it('should update amount', () => {
    const bill = Bill.create(createDefaultBillProps());
    const newAmount = new Decimal(200.75);

    bill.updateAmount(newAmount);

    expect(bill.amount).toEqual(newAmount);
  });

  it('should update portion', () => {
    const bill = Bill.create(createDefaultBillProps());
    const newPortion = 2;

    bill.updatePortion(newPortion);

    expect(bill.portion).toBe(newPortion);
  });

  it('should update purchased date', () => {
    const bill = Bill.create(createDefaultBillProps());
    const newPurchasedDate = new Date('2023-02-01');

    bill.updatePurchasedDate(newPurchasedDate);

    expect(bill.purchasedDate).toEqual(newPurchasedDate);
  });

  it('should update invoice ID', () => {
    const bill = Bill.create(createDefaultBillProps());
    const newInvoiceId = 2;

    bill.updateInvoice(newInvoiceId);

    expect(bill.invoiceId).toBe(newInvoiceId);
  });

  it('should get all properties correctly', () => {
    const billProps = createDefaultBillProps();
    const bill = Bill.create(billProps);

    expect(bill.description).toBe(billProps.description);
    expect(bill.amount).toEqual(billProps.amount);
    expect(bill.portion).toBe(billProps.portion);
    expect(bill.purchasedDate).toEqual(billProps.purchasedDate);
    expect(bill.invoiceId).toBe(billProps.invoiceId);
  });

  it('should use toJSON() method', () => {
    const billProps = createDefaultBillProps();
    const bill = Bill.create(billProps);

    const jsonResult = bill.toJSON();

    expect(jsonResult).toStrictEqual({
      id: bill.id,
      description: billProps.description,
      amount: billProps.amount.toString(),
      portion: billProps.portion,
      purchasedDate: billProps.purchasedDate,
      invoiceId: billProps.invoiceId,
    });
  });

  it('should handle Decimal amounts correctly', () => {
    const billProps = createDefaultBillProps();
    billProps.amount = new Decimal('100.55');

    const bill = Bill.create(billProps);
    const jsonResult = bill.toJSON();

    expect(jsonResult.amount).toBe('100.55');
    expect(bill.amount).toEqual(new Decimal('100.55'));
  });
});
