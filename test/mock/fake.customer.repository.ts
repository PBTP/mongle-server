import { CustomerEntity } from '../../src/schemas/customer.entity';
import { ICustomerRepository } from '../../src/customer/port/customer.repository';

export class FakeCustomerRepository implements ICustomerRepository{
  customers: CustomerEntity[] = [];

  create(customer: CustomerEntity): CustomerEntity {
    return customer;
  }

  async findOne(customer: CustomerEntity): Promise<CustomerEntity> {
    return this.customers.find((c) => c.uuid === customer.uuid || c.customerId === customer.customerId);
  }

  async save(customer: CustomerEntity): Promise<CustomerEntity> {
    customer.customerId = this.customers.length + 1;
    this.customers.push(customer);
    return customer;
  }


}
