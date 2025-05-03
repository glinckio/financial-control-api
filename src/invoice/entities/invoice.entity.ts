import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bill } from '../../bill/entities/bill.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  number!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalValue!: number;

  @Column()
  description!: string;

  @Column()
  numberOfBills!: number;

  @OneToMany(() => Bill, (bill) => bill.invoice)
  bills!: Bill[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
