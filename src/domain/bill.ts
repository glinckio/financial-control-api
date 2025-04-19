import { Decimal } from '@prisma/client/runtime/library';

export type BillProps = {
  description: string;
  amount: Decimal;
  portion: number;
  purchasedDate: Date;
  invoiceId: number;
};

export class Bill {
  public readonly id: number;
  public props: Required<BillProps>;

  private constructor(props: BillProps, id?: number) {
    this.id = id || new Date().getTime();
    this.props = {
      ...props,
    };
  }

  static create(props: BillProps, id?: number): Bill {
    return new Bill(props, id);
  }

  get description(): string {
    return this.props.description;
  }

  get amount(): Decimal {
    return this.props.amount;
  }

  get portion(): number {
    return this.props.portion;
  }

  get purchasedDate(): Date {
    return this.props.purchasedDate;
  }

  get invoiceId(): number {
    return this.props.invoiceId;
  }

  updateDescription(description: string): void {
    this.props.description = description;
  }

  updateAmount(amount: Decimal): void {
    this.props.amount = amount;
  }

  updatePortion(portion: number): void {
    this.props.portion = portion;
  }

  updatePurchasedDate(purchasedDate: Date): void {
    this.props.purchasedDate = purchasedDate;
  }

  updateInvoice(invoiceId: number): void {
    this.props.invoiceId = invoiceId;
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      amount: this.amount.toString(),
      portion: this.portion,
      purchasedDate: this.purchasedDate,
      invoiceId: this.invoiceId,
    };
  }
}
