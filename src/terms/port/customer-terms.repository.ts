import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerTermEntity } from '../../schemas/customer-terms.entity';
import { CustomerEntity } from '../../schemas/customer.entity';
import { TermEntity } from '../../schemas/terms.entity';

export const CUSTOMER_TERM_REPOSITORY = Symbol('CustomerTermRepository');

export interface ICustomerTermRepository {
  create(entity: CustomerTermEntity): Promise<CustomerTermEntity>;
  findByCustomerAndTerm(
    customer: CustomerEntity,
    term: TermEntity,
  ): Promise<CustomerTermEntity | null>;
  findByCustomerIdAndTermId(
    customerId: number,
    termId: number,
  ): Promise<CustomerTermEntity | null>;
  findByCustomer(customer: CustomerEntity): Promise<CustomerTermEntity[]>;
  deleteCustomerTerms(customerId: number): Promise<void>;
  saveAll(entities: CustomerTermEntity[]): Promise<CustomerTermEntity[]>;
}

@Injectable()
export class CustomerTermRepository implements ICustomerTermRepository {
  constructor(
    @InjectRepository(CustomerTermEntity)
    private readonly customerTermDB: Repository<CustomerTermEntity>,
  ) {}

  async create(entity: CustomerTermEntity): Promise<CustomerTermEntity> {
    return await this.customerTermDB.save(entity);
  }

  async findByCustomerAndTerm(
    customer: CustomerEntity,
    term: TermEntity,
  ): Promise<CustomerTermEntity | null> {
    return await this.customerTermDB.findOne({ where: { customer, term } });
  }

  async findByCustomerIdAndTermId(
    customerId: number,
    termId: number,
  ): Promise<CustomerTermEntity | null> {
    return await this.customerTermDB
      .createQueryBuilder('ct')
      .where('ct.customer_id = :customerId', { customerId })
      .andWhere('ct.term_id = :termId', { termId })
      .getOne();
  }

  async findByCustomer(
    customer: CustomerEntity,
  ): Promise<CustomerTermEntity[]> {
    return await this.customerTermDB.findBy({ customer: customer });
  }

  async deleteCustomerTerms(customerId: number): Promise<void> {
    await this.customerTermDB
      .createQueryBuilder()
      .delete()
      .from(CustomerTermEntity)
      .where('customer_id = :customerId', { customerId })
      .execute();
  }

  async saveAll(entities: CustomerTermEntity[]): Promise<CustomerTermEntity[]> {
    return await this.customerTermDB.save(entities);
  }
}
