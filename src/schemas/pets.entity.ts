import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from './appointments.entity';
import { Breed } from './breed.entity';
import { Customer } from './customers.entity';
import { Review } from './reviews.entity';
import { HasUuid } from '../common/entity/parent.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity({ name: 'pets' })
export class Pet extends HasUuid {
  @PrimaryColumn()
  public petId: number;

  @Column()
  public name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  public gender: string;

  @Column({ type: 'date' })
  public birthdate: Date;

  @Column()
  public weight: string;

  @Column()
  public neuteredYn: boolean;

  @Column()
  public personality: string;

  @Column()
  public vaccinationStatus: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public modifiedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(() => Review, (reviews) => reviews.pet)
  public reviews: Review[];

  @OneToMany(() => Appointment, (appointments) => appointments.pet)
  public appointments: Appointment[];

  @ManyToOne(() => Customer, (customers) => customers.pets)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customer;

  @ManyToOne(() => Breed, (breed) => breed.pets)
  @JoinColumn({ name: 'breed_id' })
  public breed: Breed;
}
