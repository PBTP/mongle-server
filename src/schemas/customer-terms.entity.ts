import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerTermDto } from '../terms/presentation/customter-terms.dto';
import { CustomerEntity } from './customer.entity';
import { TermEntity } from './terms.entity';

@Entity({ name: 'customer_terms' })
export class CustomerTermEntity {
  @Column()
  public version: number;

  @Column()
  public hasAgreed: boolean;

  @CreateDateColumn()
  public checkedAt?: Date;

  @UpdateDateColumn()
  public modifiedAt?: Date;

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
    entity.hasAgreed = dto.hasAgreed;
    return entity;
  }
}
