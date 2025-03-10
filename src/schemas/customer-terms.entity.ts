import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CustomerTermDto } from '../terms/presentation/customer-terms.dto';
import { CustomerEntity } from './customer.entity';
import { TermEntity } from './terms.entity';

@Entity({ name: 'customer_terms' })
@Unique(['customer', 'term'])
export class CustomerTermEntity {
  @Column()
  public version: number;

  @CreateDateColumn()
  public agreedAt: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.customerTerms)
  @JoinColumn({ name: 'customer_id' })
  public customer: CustomerEntity;

  @ManyToOne(() => TermEntity, (term) => term.customerTerms)
  @JoinColumn({ name: 'term_id' })
  public term: TermEntity;

  static create(
    dto: CustomerTermDto,
    customer: CustomerEntity,
    term: TermEntity,
  ): CustomerTermEntity {
    const entity = new CustomerTermEntity();
    entity.customer = customer;
    entity.term = term;
    entity.version = dto.version;
    entity.agreedAt = dto.agreedAt;
    return entity;
  }
}
