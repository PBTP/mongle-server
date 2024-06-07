import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from './appointments.entity';
import { Business } from './business.entity';
import { Customer } from './customers.entity';
import { Pet } from './pets.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryColumn()
  public reviewId: number;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

  @Column()
  public rating: number;

  @Column()
  public content: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public modifiedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @ManyToOne(() => Appointment, (appointments) => appointments.reviews)
  @JoinColumn({ name: 'appointment_id' })
  public appointment: Appointment;

  @ManyToOne(() => Customer, (customers) => customers.reviews)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customer;

  @ManyToOne(() => Business, (business) => business.reviews)
  @JoinColumn({ name: 'business_id' })
  public business: Business;

  @ManyToOne(() => Pet, (pets) => pets.reviews)
  @JoinColumn({ name: 'pet_id' })
  public pet: Pet;
}
