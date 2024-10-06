import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from './appointments.entity';
import { Breed } from './breed.entity';
import { Customer } from './customer.entity';
import { Review } from './reviews.entity';
import { HasUuid } from '../common/entity/parent.entity';
import { PetChecklistAnswer } from './pet-checklist-answer.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity({ name: 'pets' })
export class Pet extends HasUuid {
  @PrimaryColumn()
  public petId: number;

  @Column()
  public petName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  public petGender: string;

  @Column({
    type: 'date',
  })
  public petBirthdate: Date;

  @Column({
    type: 'double precision',
  })
  public petWeight: number;

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

  @ManyToOne(
    () => PetChecklistAnswer,
    (petChecklistAnswer) => petChecklistAnswer.pet,
  )
  @JoinColumn({ name: 'pet_id' })
  petChecklistAnswer: PetChecklistAnswer;
}
