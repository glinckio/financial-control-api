import { InvoiceType } from '../utils/types';

export type InvoiceProps = {
  type: InvoiceType;
  emited: Date;
  endDate: Date;
  total: number;
  portions: number;
};

export class Invoice {
  public readonly id: number;
  public props: Required<InvoiceProps>;

  private constructor(props: InvoiceProps, id?: number) {
    this.id = id || new Date().getTime();
    this.props = {
      ...props,
    };
  }

  static create(props: InvoiceProps, id?: number): Invoice {
    return new Invoice(props, id);
  }

  updateType(type: InvoiceType) {
    this.props.type = type;
  }

  updateEmited(emited: Date) {
    this.props.emited = emited;
  }

  updateEndDate(endDate: Date) {
    this.props.endDate = endDate;
  }

  updateTotal(total: number) {
    this.props.total = total;
  }

  updatePortions(portions: number) {
    this.props.portions = portions;
  }

  get type() {
    return this.props.type;
  }

  private set type(value: InvoiceType) {
    this.props.type = value;
  }

  get emited() {
    return this.props.emited;
  }

  private set emited(value: Date) {
    this.props.emited = value;
  }

  get endDate() {
    return this.props.endDate;
  }

  private set endDate(value: Date) {
    this.props.endDate = value;
  }

  get total() {
    return this.props.total;
  }

  private set total(value: number) {
    this.props.total = value;
  }

  get portions() {
    return this.props.portions;
  }

  private set portions(value: number) {
    this.props.portions = value;
  }

  toJSON() {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
