import { BillTransformer } from '../../main/transformers/bill.transformer';
import { Bill } from '../../domain/bill';
import { BillRepositoryInterface } from '../../data/protocols/db/bill/bill-repository.interface';

export class AddBillUseCase {
  constructor(private readonly billRepository: BillRepositoryInterface) {}

  async create(bill: Bill) {
    const billDb = await this.billRepository.create(bill);
    return BillTransformer.toBill(billDb);
  }
}
