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
import { Appointment } from './appointments.entity';
import { Business } from './business.entity';
import { HasUuid } from '../common/entity/parent.entity';

export enum PetSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export type TServiceOption = {
  serviceOptionId: number;
  serviceOptionDescription: string;
  serviceOptionPrice: string;
  petSize: PetSize;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
  appointments: Appointment[];
  business: Business;
};

@Entity({ name: 'service_options' })
//TODO: 추후 UUID -> TSID로 변경
export class ServiceOption extends HasUuid implements TServiceOption {
  @PrimaryColumn()
  public serviceOptionId: number;

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
