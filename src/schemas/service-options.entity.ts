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
import { Business } from './business.entity';

export enum PetSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

@Entity({ name: 'service_options' })
export class ServiceOption {
  @PrimaryColumn()
  public serviceOptionId: number;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

  public serviceOptionDescription: string;

  @Column()
  public serviceOptionPrice: string;

  @Column({
    type: 'enum',
    enum: PetSize,
    default: PetSize.SMALL,
  })
  public petSize: PetSize;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public modifiedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(() => Appointment, (appointments) => appointments.serviceOption)
  public appointments: Appointment[];

  @ManyToOne(() => Business, (business) => business.serviceOptions)
  @JoinColumn({ name: 'business_id' })
  public business: Business;
}
