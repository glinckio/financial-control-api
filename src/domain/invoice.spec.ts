import { Invoice, InvoiceProps } from './invoice';
import { InvoiceType } from '../utils/types';

describe('Invoice Unit Tests', () => {
  it('should create an Invoice instance', () => {
    const now = new Date();
    const invoiceProps: InvoiceProps = {
      type: InvoiceType.HIPER,
      emited: now,
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      total: 100.5,
      portions: 5,
    };
    let invoice = Invoice.create(invoiceProps);
    expect(invoice.props).toEqual({
      ...invoiceProps,
    });

    expect(invoice.id).toBeDefined();
    invoice = Invoice.create(invoiceProps);
    expect(invoice.props).toEqual({
      ...invoiceProps,
    });
  });

  it('should update type', () => {
    const invoiceProps: InvoiceProps = {
      type: InvoiceType.HIPER,
      emited: new Date(),
      endDate: new Date(),
      total: 100.5,
      portions: 5,
    };
    const invoice = Invoice.create(invoiceProps);
    invoice.updateType(InvoiceType.MASTER);
    expect(invoice.type).toBe(InvoiceType.MASTER);
  });

  it('should update emited date', () => {
    const invoiceProps: InvoiceProps = {
      type: InvoiceType.HIPER,
      emited: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
      total: 100.5,
      portions: 5,
    };
    const invoice = Invoice.create(invoiceProps);
    const newEmitedDate = new Date('2023-02-01');
    invoice.updateEmited(newEmitedDate);
    expect(invoice.emited).toEqual(newEmitedDate);
  });

  it('should update end date', () => {
    const invoiceProps: InvoiceProps = {
      type: InvoiceType.HIPER,
      emited: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
      total: 100.5,
      portions: 5,
    };
    const invoice = Invoice.create(invoiceProps);
    const newEndDate = new Date('2023-03-01');
    invoice.updateEndDate(newEndDate);
    expect(invoice.endDate).toEqual(newEndDate);
  });

  it('should update total', () => {
    const invoiceProps: InvoiceProps = {
      type: InvoiceType.HIPER,
      emited: new Date(),
      endDate: new Date(),
      total: 100.5,
      portions: 5,
    };
    const invoice = Invoice.create(invoiceProps);
    invoice.updateTotal(200.75);
    expect(invoice.total).toBe(200.75);
  });

  it('should use toJSON() method', () => {
    const now = new Date();
    const invoiceProps: InvoiceProps = {
      type: InvoiceType.HIPER,
      emited: now,
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      total: 100.5,
      portions: 5,
    };
    const invoice = Invoice.create(invoiceProps);
    const jsonResult = invoice.toJSON();
    expect(jsonResult).toStrictEqual({
      id: invoice.id,
      type: InvoiceType.HIPER,
      emited: now,
      endDate: invoiceProps.endDate,
      total: 100.5,
      portions: 5,
    });
  });
});
