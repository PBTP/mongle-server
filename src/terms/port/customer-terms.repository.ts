import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerTermEntity } from '../../schemas/customer-terms.entity';
import { CustomerTerm } from '../customer-terms.domain';

export const CUSTOMER_TERM_REPOSITORY = Symbol('CustomerTermRepository');

export interface ICustomerTermRepository {
  findByCustomerIdAndTermId(
    customerId: number,
    termId: number,
  ): Promise<CustomerTerm | null>;
  findByCustomer(customerId: number): Promise<CustomerTerm[]>;
  deleteCustomerTerms(customerId: number): Promise<void>;
  save(entity: CustomerTerm): Promise<CustomerTerm>;
  saveAll(entities: CustomerTerm[]): Promise<CustomerTerm[]>;
}

@Injectable()
export class CustomerTermRepository implements ICustomerTermRepository {
  constructor(
    @InjectRepository(CustomerTermEntity)
    private readonly customerTermDB: Repository<CustomerTermEntity>,
  ) { }

  async findByCustomerIdAndTermId(
    customerId: number,
    termId: number,
  ): Promise<CustomerTerm | null> {
    const entity = await this.customerTermDB.findOneBy({
      customerId: customerId,
      termId: termId,
    });
    if (!entity) return null;
    return CustomerTerm.from(entity);

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

  async findByCustomer(customerId: number): Promise<CustomerTerm[]> {
    const entities = await this.customerTermDB.find({
      where: { customer: { customerId: customerId } },
      relations: ['customer', 'term']
    })
    return entities.map(CustomerTerm.from);
  }

  async deleteCustomerTerms(customerId: number): Promise<void> {
    await this.customerTermDB.delete({ customerId });
  }

  async save(domain: CustomerTerm): Promise<CustomerTerm> {
    return await this.customerTermDB.save(domain);
  }


  async saveAll(domains: CustomerTerm[]): Promise<CustomerTerm[]> {
    return await this.customerTermDB.save(domains);
  }
}
