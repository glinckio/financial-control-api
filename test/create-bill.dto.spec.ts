import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateBillDto } from '../src/bill/dto/create-bill.dto';

describe('CreateBillDto', () => {
  it('should validate a valid DTO', async () => {
    const dto = plainToInstance(CreateBillDto, {
      invoiceId: '1',
      installmentNumber: 1,
      dueDate: new Date(),
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate invoiceId is string', async () => {
    const dto = plainToInstance(CreateBillDto, {
      invoiceId: 123,
      installmentNumber: 1,
      dueDate: new Date(),
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });

  it('should validate installmentNumber is number', async () => {
    const dto = plainToInstance(CreateBillDto, {
      invoiceId: '1',
      installmentNumber: '1',
      dueDate: new Date(),
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNumber).toBeDefined();
  });

  it('should validate installmentNumber is positive', async () => {
    const dto = plainToInstance(CreateBillDto, {
      invoiceId: '1',
      installmentNumber: -1,
      dueDate: new Date(),
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isPositive).toBeDefined();
  });

  it('should validate dueDate is date', async () => {
    const dto = plainToInstance(CreateBillDto, {
      invoiceId: '1',
      installmentNumber: 1,
      dueDate: 'not a date',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isDate).toBeDefined();
  });

  it('should transform dueDate string to Date object', () => {
    const dateStr = '2024-01-01';
    const dto = plainToInstance(CreateBillDto, {
      invoiceId: '1',
      installmentNumber: 1,
      dueDate: dateStr,
    });

    expect(dto.dueDate).toBeInstanceOf(Date);
    expect(dto.dueDate.toISOString()).toContain('2024-01-01');
  });
});
