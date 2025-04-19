import { InvoiceModel } from '../../infrastructure/database/prisma/models/invoice.model';

export class InvoiceTransformer {
  static toInvoice = (invoice: InvoiceModel) => ({
    id: invoice.id,
    type: invoice.type,
    emited: invoice.emited,
    endDate: invoice.endDate,
    total: invoice.total,
  });

  static toInvoices(invoice: InvoiceModel[]) {
    return invoice.map(this.toInvoice);
  }
}
