import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { TermEntity } from './terms.entity';

@Entity({ name: 'customer_terms' })
export class CustomerTermEntity {
  @Column()
  public version: number;

  @Column({
    type: 'date',
  })
  public agreedAt: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.customerTerms)
  @JoinColumn({ name: 'customer_id' })
  public customer: CustomerEntity;

  @ManyToOne(() => TermEntity, (term) => term.customerTerms)
  @JoinColumn({ name: 'term_id' })
  public term: TermEntity;
}
