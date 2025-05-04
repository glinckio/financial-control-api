import { Bill } from '../src/bill/entities/bill.entity';
import { Invoice } from '../src/invoice/entities/invoice.entity';

describe('Bill Entity', () => {
  let bill: Bill;
  let invoice: Invoice;

  beforeEach(() => {
    invoice = new Invoice();
    invoice.id = '1';
    invoice.name = 'Test Invoice';
    invoice.number = 'INV-202401-0001';
    invoice.totalValue = 1000;
    invoice.description = 'Test Description';
    invoice.numberOfBills = 3;
    invoice.bills = [];
    invoice.createdAt = new Date();
    invoice.updatedAt = new Date();

    bill = new Bill();
    bill.id = '1';
    bill.value = 333.33;
    bill.installmentNumber = 1;
    bill.dueDate = new Date();
    bill.isPaid = false;
    bill.invoice = invoice;
    bill.createdAt = new Date();
    bill.updatedAt = new Date();
  });

  it('should create a bill instance', () => {
    expect(bill).toBeDefined();
    expect(bill).toBeInstanceOf(Bill);
  });

  it('should have all required properties', () => {
    expect(bill.id).toBeDefined();
    expect(bill.value).toBeDefined();
    expect(bill.installmentNumber).toBeDefined();
    expect(bill.dueDate).toBeDefined();
    expect(bill.isPaid).toBeDefined();
    expect(bill.invoice).toBeDefined();
    expect(bill.createdAt).toBeDefined();
    expect(bill.updatedAt).toBeDefined();
  });

  it('should have correct property types', () => {
    expect(typeof bill.id).toBe('string');
    expect(typeof bill.value).toBe('number');
    expect(typeof bill.installmentNumber).toBe('number');
    expect(bill.dueDate).toBeInstanceOf(Date);
    expect(typeof bill.isPaid).toBe('boolean');
    expect(bill.invoice).toBeInstanceOf(Invoice);
    expect(bill.createdAt).toBeInstanceOf(Date);
    expect(bill.updatedAt).toBeInstanceOf(Date);
  });

  it('should have correct property values', () => {
    expect(bill.id).toBe('1');
    expect(bill.value).toBe(333.33);
    expect(bill.installmentNumber).toBe(1);
    expect(bill.isPaid).toBe(false);
    expect(bill.invoice).toBe(invoice);
  });

  it('should have correct relationship with Invoice', () => {
    expect(bill.invoice.id).toBe(invoice.id);
    expect(bill.invoice.name).toBe(invoice.name);
    expect(bill.invoice.number).toBe(invoice.number);
    expect(bill.invoice.totalValue).toBe(invoice.totalValue);
    expect(bill.invoice.description).toBe(invoice.description);
    expect(bill.invoice.numberOfBills).toBe(invoice.numberOfBills);
  });
});
