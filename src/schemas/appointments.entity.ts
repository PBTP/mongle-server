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
import { Business } from './business.entity';
import { Customer } from './customers.entity';
import { Driver } from './drivers.entity';
import { Pet } from './pets.entity';
import { Review } from './reviews.entity';
import { ServiceOption } from './service-options.entity';

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryColumn()
  public appointmentId: number;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

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

  @ManyToOne(() => Customer, (customers) => customers.appointments)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customer;

  @ManyToOne(() => Business, (business) => business.appointments)
  @JoinColumn({ name: 'business_id' })
  public business: Business;

  @ManyToOne(() => Driver, (drivers) => drivers.appointments)
  @JoinColumn({ name: 'driver_id' })
  public driver: Driver;

  @ManyToOne(() => Pet, (pets) => pets.appointments)
  @JoinColumn({ name: 'pet_id' })
  public pet: Pet;

  @ManyToOne(
    () => ServiceOption,
    (serviceOptions) => serviceOptions.appointments,
  )
  @JoinColumn({ name: 'service_option_id' })
  public serviceOption: ServiceOption;
}
