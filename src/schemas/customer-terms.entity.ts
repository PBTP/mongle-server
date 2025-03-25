import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { TermEntity } from './terms.entity';
import { CustomerTerm } from 'src/terms/customer-terms.domain';
import { Builder } from 'builder-pattern';

@Entity({ name: 'customer_terms' })
export class CustomerTermEntity {
  @PrimaryColumn({ name: 'customer_id', type: 'int' })
  public customerId: number;

  @PrimaryColumn({ name: 'term_id', type: 'int' })
  public termId: number;

  @ManyToOne(() => CustomerEntity, (customer) => customer.customerTerms)
  @JoinColumn({ name: 'customer_id' })
  public customer: CustomerEntity;

  @ManyToOne(() => TermEntity, (term) => term.customerTerms)
  @JoinColumn({ name: 'term_id' })
  public term: TermEntity;

  @Column()
  public version: number;

  @CreateDateColumn()
  public agreedAt: Date;

  toModel(): CustomerTerm {
    return CustomerTerm.from(this);
  }

  // Domain → Entity
  static from(domain: CustomerTerm): CustomerTermEntity {
    return Builder(CustomerTermEntity)
      .customerId(domain.customer.customerId ? domain.customer.customerId : 0) // TODO: customerId 해결
      .termId(domain.term.termId)
      .customer(CustomerEntity.from(domain.customer))
      .term(TermEntity.from(domain.term))
      .version(domain.version)
      .agreedAt(domain.agreedAt)
      .build();
  }
}

