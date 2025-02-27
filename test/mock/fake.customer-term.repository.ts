import { CustomerTermEntity } from '../../src/schemas/customer-terms.entity';
import { CustomerEntity } from '../../src/schemas/customer.entity';
import { TermEntity } from '../../src/schemas/terms.entity';
import { ICustomerTermRepository } from '../../src/terms/port/customer-terms.repository';

export class FakeCustomerTermRepository implements ICustomerTermRepository {
  private customerTerms: CustomerTermEntity[] = [];

  async create(entity: CustomerTermEntity): Promise<CustomerTermEntity> {
    entity.id = this.customerTerms.length + 1;
    this.customerTerms.push(entity);
    return entity;
  }

  async findByCustomerAndTerm(
    customer: CustomerEntity,
    term: TermEntity,
  ): Promise<CustomerTermEntity | null> {
    return (
      this.customerTerms.find(
        (ct) =>
          ct.customer.customerId === customer.customerId &&
          ct.term.termId === term.termId,
      ) || null
    );
  }

  async findByCustomerIdAndTermId(
    customerId: number,
    termId: number,
  ): Promise<CustomerTermEntity | null> {
    return (
      this.customerTerms.find(
        (ct) =>
          ct.customer.customerId === customerId && ct.term.termId === termId,
      ) || null
    );
  }

  async findByCustomer(
    customer: CustomerEntity,
  ): Promise<CustomerTermEntity[]> {
    return this.customerTerms.filter(
      (ct) => ct.customer.customerId === customer.customerId,
    );
  }

  async deleteCustomerTerms(customerId: number): Promise<void> {
    this.customerTerms = this.customerTerms.filter(
      (ct) => ct.customer.customerId !== customerId,
    );
  }

  async saveAll(entities: CustomerTermEntity[]): Promise<CustomerTermEntity[]> {
    entities.forEach((entity) => {
      const existingIndex = this.customerTerms.findIndex(
        (ct) =>
          ct.customer.customerId === entity.customer.customerId &&
          ct.term.termId === entity.term.termId,
      );
      if (existingIndex !== -1) {
        this.customerTerms[existingIndex] = entity;
      } else {
        entity.id = this.customerTerms.length + 1;
        this.customerTerms.push(entity);
      }
    });
    return entities;
  }
}
