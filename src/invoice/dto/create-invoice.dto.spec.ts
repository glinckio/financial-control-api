import { validate } from 'class-validator';
import { CreateInvoiceDto } from './create-invoice.dto';

describe('CreateInvoiceDto', () => {
  it('should be defined', () => {
    expect(new CreateInvoiceDto()).toBeDefined();
  });

  it('should validate valid data', async () => {
    const dto = new CreateInvoiceDto();
    dto.name = 'Test Invoice';
    dto.totalValue = 1000;
    dto.description = 'Test Description';
    dto.numberOfBills = 3;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with missing name', async () => {
    const dto = new CreateInvoiceDto();
    dto.totalValue = 1000;
    dto.description = 'Test Description';
    dto.numberOfBills = 3;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with non-positive totalValue', async () => {
    const dto = new CreateInvoiceDto();
    dto.name = 'Test Invoice';
    dto.totalValue = 0;
    dto.description = 'Test Description';
    dto.numberOfBills = 3;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('totalValue');
  });

  it('should fail validation with non-positive numberOfBills', async () => {
    const dto = new CreateInvoiceDto();
    dto.name = 'Test Invoice';
    dto.totalValue = 1000;
    dto.description = 'Test Description';
    dto.numberOfBills = 0;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('numberOfBills');
  });

  it('should fail validation with empty description', async () => {
    const dto = new CreateInvoiceDto();
    dto.name = 'Test Invoice';
    dto.totalValue = 1000;
    dto.description = '';
    dto.numberOfBills = 3;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });
});
