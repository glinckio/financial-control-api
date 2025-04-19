import { InvoiceType } from '../../../../../utils/types';
import { Invoice, InvoiceProps } from '../../../../../domain/invoice';
import { PrismaInvoiceRepository } from './prisma-invoice-repository';

const invoiceProps: InvoiceProps = {
  type: InvoiceType.HIPER,
  emited: new Date('2025-04-18T01:42:55.537Z'),
  endDate: new Date('2025-04-18T01:42:55.537Z'),
  total: 100.5,
  portions: 5,
};

const mockPrismaClient = {
  invoice: {
    create: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
  Prisma: {
    Decimal: jest.fn().mockImplementation((value) => ({
      toNumber: () => Number(value),
    })),
  },
}));

describe('PrismaInvoiceRepository Unit Test', () => {
  let prismaInvoiceRepository: PrismaInvoiceRepository;

  beforeEach(() => {
    prismaInvoiceRepository = new PrismaInvoiceRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
      const invoice = Invoice.create(invoiceProps);
      const expectedCreatedInvoice = {
        id: 1,
        type: invoice.type,
        emited: invoice.emited,
        endDate: invoice.endDate,
        total: {
          toNumber: () => invoice.total,
        },
        portions: 5,
      };

      mockPrismaClient.invoice.create.mockResolvedValue(expectedCreatedInvoice);

      const result = await prismaInvoiceRepository.create(invoice);

      expect(result).toEqual({
        id: expectedCreatedInvoice.id,
        type: expectedCreatedInvoice.type,
        emited: expectedCreatedInvoice.emited,
        endDate: expectedCreatedInvoice.endDate,
        total: invoice.total,
        portions: invoice.portions,
      });

      expect(mockPrismaClient.invoice.create).toHaveBeenCalledWith({
        data: {
          type: invoice.type,
          emited: invoice.emited,
          endDate: invoice.endDate,
          total: expect.any(Object),
          portions: invoice.portions,
        },
      });
    });
  });
});
