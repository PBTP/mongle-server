import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerTermEntity } from '../../schemas/customer-terms.entity';

export const CUSTOMER_TERM_REPOSITORY = Symbol('CustomerTermRepository');

export interface ICustomerTermRepository {
  create(entity: CustomerTermEntity): Promise<CustomerTermEntity>;
  saveAll(entities: CustomerTermEntity[]): Promise<CustomerTermEntity[]>;
}

@Injectable()
export class CustomerTermRepository implements ICustomerTermRepository {
  constructor(
    @InjectRepository(CustomerTermEntity)
    private readonly customerTermDB: Repository<CustomerTermEntity>,
  ) {}

  async saveAll(entities: CustomerTermEntity[]): Promise<CustomerTermEntity[]> {
    return await this.customerTermDB.save(entities);
  }

  async create(entity: CustomerTermEntity): Promise<CustomerTermEntity> {
    return await this.customerTermDB.save(entity);
  }
}
