import { CustomerEntity } from '../../src/schemas/customer.entity';
import { ICustomerRepository } from '../../src/customer/port/customer.repository';
import { Customer, ICustomer } from '../../src/customer/customer.domain';
import { Builder } from 'builder-pattern';
import { getTsid } from 'tsid-ts';
import { CustomerDto } from '../../src/customer/presentation/customer.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

export class FakeCustomerRepository implements ICustomerRepository {
  customers: Customer[] = [];

  create(customer: Customer): CustomerEntity {
    return Builder<CustomerEntity>()
      .uuid(customer.uuid ?? getTsid().toString())
      .customerName(customer.customerName)
      .customerPhoneNumber(customer.customerPhoneNumber)
      .customerAddress(customer.customerAddress)
      .customerDetailAddress(customer.customerDetailAddress)
      .authProvider(customer.authProvider)
      .createdAt(customer.createdAt ?? new Date())
      .modifiedAt(customer.modifiedAt ?? new Date())
      .deletedAt(undefined)
      .refreshToken(customer.refreshToken)
      .build();
  }

  async findOne(dto: Partial<CustomerDto>): Promise<Customer> {
    if (!dto.uuid && !dto.userId && !dto.customerId) {
      throw new BadRequestException(
        `식별할 수 있는 값이 없습니다. uuid: ${dto.uuid}, userId: ${dto.userId}, customerId: ${dto.customerId}`,
      );
    }

    const findCustomer = this.customers.find(
      (c: Customer) =>
        c.uuid === dto.uuid ||
        c.customerId === dto.userId ||
        c.customerId === dto.customerId,
    );
    if (!findCustomer) {
      throw new Error('존재하지 않는 사용자입니다.');
    }
    return findCustomer;
  }

  async save(customer: Customer): Promise<ICustomer> {
    if (!customer.customerName || !customer.authProvider) {
      throw new Error('필수 정보가 누락되었습니다.');
    }

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
