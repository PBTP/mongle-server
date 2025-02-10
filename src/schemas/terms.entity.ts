import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'terms' })
export class TermEntity {
  @PrimaryGeneratedColumn()
  termId: number;

  @Column({ nullable: false })
  version: number;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ default: false })
  isMandatory: boolean;

  @Column({ nullable: false, length: 30 })
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => CustomerTermEntity, (customerTerm) => customerTerm.term)
  customerTerms: CustomerTermEntity[];
}

@Entity({ name: 'customer_terms' })
export class CustomerTermEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  version: number;

  @Column({ nullable: true })
  agreedAt: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.customerTerms)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @ManyToOne(() => TermEntity, (term) => term.customerTerms)
  @JoinColumn({ name: 'term_id' })
  term: TermEntity;
}
