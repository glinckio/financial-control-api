import { PrismaClient } from '@prisma/client';
import { Invoice } from '../../../../../domain/invoice';
import { InvoiceModel } from '../../models/invoice.model';
import { InvoiceRepositoryInterface } from '../../../../../data/protocols/db/invoice/invoice-repository.interface';
import { Decimal } from '@prisma/client/runtime/library';

export class PrismaInvoiceRepository implements InvoiceRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private mapDecimalToNumber(decimal: any): number {
    if (decimal && typeof decimal === 'object' && 'toNumber' in decimal) {
      return decimal.toNumber();
    }
    return Number(decimal);
  }

  private mapInvoiceToModel(prismaInvoice: any): InvoiceModel {
    return {
      id: prismaInvoice.id,
      type: prismaInvoice.type,
      emited: prismaInvoice.emited,
      endDate: prismaInvoice.endDate,
      total: this.mapDecimalToNumber(prismaInvoice.total),
      portions: prismaInvoice.portions,
    };
  }

  async create(data: Invoice): Promise<InvoiceModel> {
    const result = await this.prisma.invoice.create({
      data: {
        type: data.type,
        emited: data.emited,
        endDate: data.endDate,
        total: new Decimal(data.props.total),
        portions: data.portions,
      },
    });

    return this.mapInvoiceToModel(result);
  }
}
