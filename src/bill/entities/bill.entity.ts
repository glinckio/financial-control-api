import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from '../../invoice/entities/invoice.entity';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  value!: number;

  @Column()
  installmentNumber!: number;

  @Column()
  dueDate!: Date;

  @Column({ default: false })
  isPaid!: boolean;

  @ManyToOne(() => Invoice, (invoice) => invoice.bills)
  invoice!: Invoice;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
