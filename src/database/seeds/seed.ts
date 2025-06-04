import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { Bill } from '../../bill/entities/bill.entity';
import * as bcrypt from 'bcrypt';
import { ROLES } from '../../common/constants/app.constants';
import { faker } from '@faker-js/faker';

export async function seed(dataSource: DataSource) {
  // Clear existing data
  await dataSource.query('TRUNCATE TABLE bills CASCADE');
  await dataSource.query('TRUNCATE TABLE invoices CASCADE');
  await dataSource.query('TRUNCATE TABLE users CASCADE');

  // Create users
  const users = await createUsers(dataSource);

  // Create invoices and bills
  await createInvoicesAndBills(dataSource, users);
}

async function createUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);
  const users: User[] = [];

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = userRepository.create({
    email: 'admin@example.com',
    password: adminPassword,
    name: 'Admin User',
    roles: [ROLES.ADMIN],
  });
  users.push(await userRepository.save(admin));

  // Create regular users
  for (let i = 0; i < 5; i++) {
    const password = await bcrypt.hash('user123', 10);
    const user = userRepository.create({
      email: faker.internet.email(),
      password,
      name: faker.person.fullName(),
      roles: [ROLES.USER],
    });
    users.push(await userRepository.save(user));
  }

  return users;
}

async function createInvoicesAndBills(dataSource: DataSource, users: User[]) {
  const invoiceRepository = dataSource.getRepository(Invoice);
  const billRepository = dataSource.getRepository(Bill);

  for (const user of users) {
    // Create 2-5 invoices per user
    const numInvoices = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < numInvoices; i++) {
      const totalValue = faker.number.float({
        min: 1000,
        max: 10000,
        precision: 2,
      });
      const numberOfBills = faker.number.int({ min: 1, max: 12 });
      const valuePerBill = totalValue / numberOfBills;

      const invoice = invoiceRepository.create({
        name: faker.commerce.productName(),
        number: faker.string.numeric(8),
        totalValue,
        description: faker.commerce.productDescription(),
        numberOfBills,
      });

      const savedInvoice = await invoiceRepository.save(invoice);

      for (let j = 0; j < numberOfBills; j++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + j);

        const bill = billRepository.create({
          value: valuePerBill,
          installmentNumber: j + 1,
          dueDate,
          isPaid: j === 0,
          invoice: savedInvoice,
        });

        await billRepository.save(bill);
      }
    }
  }
}
