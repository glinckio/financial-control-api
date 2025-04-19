import { InvoiceType } from '../../../../utils/types';

export class InvoiceModel {
  id: number;
  type: InvoiceType;
  emited: Date;
  endDate: Date;
  total: number;
  portions: number;
}
