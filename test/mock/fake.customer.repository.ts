import { CustomerEntity } from '../../src/schemas/customer.entity';
import { ICustomerRepository } from '../../src/customer/port/customer.repository';
import { Customer } from '../../src/customer/customer.domain';

export class FakeCustomerRepository implements ICustomerRepository {
  customers: Customer[] = [];

  create(customer: CustomerEntity): CustomerEntity {
    return customer;
  }

  async findOne(customer: CustomerEntity): Promise<Customer> {
    return this.customers.find(
      (c) => c.uuid === customer.uuid || c.customerId === customer.customerId,
    );
  }

  async save(customer: CustomerEntity): Promise<Customer> {
    let findCustomer = this.customers.find(
      (c) => c.uuid === customer.uuid || c.customerId === customer.customerId,
    );
    if (findCustomer) {
      findCustomer = customer;
      return findCustomer;
    }

    customer.customerId = this.customers.length + 1;
    this.customers.push(customer);
    return customer;
  }
}
