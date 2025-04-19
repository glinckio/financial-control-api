import { InvoiceTransformer } from '../../main/transformers/invoice.transformer';
import { InvoiceRepositoryInterface } from '../../data/protocols/db/invoice/invoice-repository.interface';
import { Invoice } from '../../domain/invoice';
import { BillRepositoryInterface } from '../../data/protocols/db/bill/bill-repository.interface';
import { Decimal } from '@prisma/client/runtime/library';
import { Bill } from '../../domain/bill';

export class AddInvoiceUseCase {
  constructor(
    private readonly invoiceRepository: InvoiceRepositoryInterface,
    private readonly billRepository: BillRepositoryInterface,
  ) {}

  async create(invoice: Invoice) {
    const invoiceDb = await this.invoiceRepository.create(invoice);

    for (let i = 1; i <= invoice.props.portions; i++) {
      const bill = Bill.create({
        amount: new Decimal(invoice.props.portions / invoice.props.total),
        description: '',
        invoiceId: invoiceDb.id,
        portion: i,
        purchasedDate: invoice.props.emited,
      });

      await this.billRepository.create(bill);
    }

    return InvoiceTransformer.toInvoice(invoiceDb);
  }
}
