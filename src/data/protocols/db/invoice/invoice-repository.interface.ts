import { Invoice } from '../../../../domain/invoice';
import { InvoiceModel } from '../../../../infrastructure/database/prisma/models/invoice.model';

export interface InvoiceRepositoryInterface {
  create: (data: Invoice) => Promise<InvoiceModel>;
}
