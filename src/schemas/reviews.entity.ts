import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import {Appointment} from './appointments.entity';
import {BusinessEntity} from './business.entity';
import {CustomerEntity} from './customer.entity';
import {PetEntity} from './pets.entity';
import {HasUuid} from '../common/entity/parent.entity';

@Entity({ name: 'reviews' })
export class Review extends HasUuid {
  @PrimaryColumn()
  public reviewId: number;

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

  @ManyToOne(() => CustomerEntity, (customers) => customers.reviews)
  @JoinColumn({ name: 'customer_id' })
  public customer: CustomerEntity;

  @ManyToOne(() => BusinessEntity, (business) => business.reviews)
  @JoinColumn({ name: 'business_id' })
  public business: BusinessEntity;

  @ManyToOne(() => PetEntity, (pets) => pets.reviews)
  @JoinColumn({ name: 'pet_id' })
  public pet: PetEntity;
}
