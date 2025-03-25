import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerTermEntity } from '../../schemas/customer-terms.entity';
import { CustomerEntity } from '../../schemas/customer.entity';

export const CUSTOMER_TERM_REPOSITORY = Symbol('CustomerTermRepository');

export interface ICustomerTermRepository {
  create(entity: CustomerTermEntity): Promise<CustomerTermEntity>;
  findByCustomerIdAndTermId(
    customerId: number,
    termId: number,
  ): Promise<CustomerTermEntity | null>;
  findByCustomer(customerId: number): Promise<CustomerTermEntity[]>;
  deleteCustomerTerms(customerId: number): Promise<void>;
  save(entity: CustomerTermEntity): Promise<CustomerTermEntity>;
  saveAll(entities: CustomerTermEntity[]): Promise<CustomerTermEntity[]>;
}

@Injectable()
export class CustomerTermRepository implements ICustomerTermRepository {
  constructor(
    @InjectRepository(CustomerTermEntity)
    private readonly customerTermDB: Repository<CustomerTermEntity>,
  ) { }

  async create(entity: CustomerTermEntity): Promise<CustomerTermEntity> {
    return await this.customerTermDB.save(entity);
  }

  async findByCustomerIdAndTermId(
    customerId: number,
    termId: number,
  ): Promise<CustomerTermEntity | null> {
    return await this.customerTermDB.findOneBy({
      customerId: customerId,
      termId: termId,
    });
    /* customer, term 객체 필요한 경우
    return await this.customerTermDB.findOne({
      where: {
        customer: { customerId: customerId },
        term: { termId: termId }
      },
      relations: ['customer', 'term']
    })
    */
  }

  async findByCustomer(customerId: number): Promise<CustomerTermEntity[]> {
    return await this.customerTermDB.find({
      where: { customer: { customerId: customerId } },
      relations: ['customer', 'term']
    })
  }

  async deleteCustomerTerms(customerId: number): Promise<void> {
    await this.customerTermDB.delete({ customerId });
  }

  async save(entity: CustomerTermEntity): Promise<CustomerTermEntity> {
    return await this.customerTermDB.save(entity);
  }


  async saveAll(entities: CustomerTermEntity[]): Promise<CustomerTermEntity[]> {
    return await this.customerTermDB.save(entities);
  }
}
