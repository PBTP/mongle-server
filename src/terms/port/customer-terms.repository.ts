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

  async saveAll(entities: CustomerTermEntity[]): Promise<CustomerTermEntity[]> {
    return await this.customerTermDB.save(entities);
  }
}
