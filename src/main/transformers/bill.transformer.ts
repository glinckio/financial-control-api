import { BillModel } from '../../infrastructure/database/prisma/models/bill.model';

export class BillTransformer {
  static toBill = (bill: BillModel) => ({
    id: bill.id,
    description: bill.description,
    amount: bill.amount,
    portion: bill.portion,
    purchasedDate: bill.purchasedDate,
    invoiceId: bill.invoiceId,
  });

  static toBills(invoice: BillModel[]) {
    return invoice.map(this.toBill);
  }
}
