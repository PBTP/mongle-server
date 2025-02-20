import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { BusinessEntity } from './business.entity';
import { CustomerEntity } from './customer.entity';
import { DriverEntity } from './drivers.entity';
import { PetEntity } from './pets.entity';
import { Review } from './reviews.entity';
import { ServiceOption } from './service-options.entity';
import { HasUuid } from '../common/entity/parent.entity';

@Entity({ name: 'appointments' })
export class Appointment extends HasUuid {
  @PrimaryColumn()
  public appointmentId: number;

  @Column({ type: 'date' })
  public appointmentDate: Date;

  @Column({ type: 'time' })
  public appointmentStartTime: Date;

  @Column({ type: 'time' })
  public appointmentEndTime: Date;

  @Column()
  public appointmentStatus: string;

  @Column()
  public specialRequest: string;

  @Column()
  public visitParkingLocation: string;

  @Column()
  public visitParkingLocationDetail: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public modifiedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(() => Review, (reviews) => reviews.appointment)
  public reviews: Review[];

  @ManyToOne(() => CustomerEntity, (customers) => customers.appointments)
  @JoinColumn({ name: 'customer_id' })
  public customer: CustomerEntity;

  @ManyToOne(() => BusinessEntity, (business) => business.appointments)
  @JoinColumn({ name: 'business_id' })
  public business: BusinessEntity;

  @ManyToOne(() => DriverEntity, (drivers) => drivers.appointments)
  @JoinColumn({ name: 'driver_id' })
  public driver: DriverEntity;

  @ManyToOne(() => PetEntity, (pets) => pets.appointments)
  @JoinColumn({ name: 'pet_id' })
  public pet: PetEntity;

  @ManyToOne(
    () => ServiceOption,
    (serviceOptions) => serviceOptions.appointments,
  )
  @JoinColumn({ name: 'service_option_id' })
  public serviceOption: ServiceOption;
}
