import { Bill } from '../../../../domain/bill';
import { BillModel } from '../../../../infrastructure/database/prisma/models/bill.model';

export interface BillRepositoryInterface {
  create: (data: Bill) => Promise<BillModel>;
}
