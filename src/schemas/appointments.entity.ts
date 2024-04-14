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
import { ApiProperty } from '@nestjs/swagger';
import { Business } from './business.entity';
import { Customers } from './customers.entity';
import { Drivers } from './drivers.entity';
import { Pets } from './pets.entity';
import { Reviews } from './reviews.entity';
import { Service_options } from './service-options.entity';

@Entity()
export class Appointments {
  @PrimaryColumn()
  @ApiProperty({
    example: 'appointment_id 예시',
    description: 'appointment_id 설명',
  })
  public appointment_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column({ type: 'date' })
  @ApiProperty({
    example: 'appointment_date 예시',
    description: 'appointment_date 설명',
  })
  public appointment_date: Date;

  @Column({ type: 'time' })
  @ApiProperty({
    example: 'appointment_start_time 예시',
    description: 'appointment_start_time 설명',
  })
  public appointment_start_time: Date;

  @Column({ type: 'time' })
  @ApiProperty({
    example: 'appointment_end_time 예시',
    description: 'appointment_end_time 설명',
  })
  public appointment_end_time: Date;

  @Column()
  @ApiProperty({
    example: 'appointment_status 예시',
    description: 'appointment_status 설명',
  })
  public appointment_status: string;

  @Column()
  @ApiProperty({
    example: 'special_request 예시',
    description: 'special_request 설명',
  })
  public special_request: string;

  @Column()
  @ApiProperty({
    example: 'visit_parking_location 예시',
    description: 'visit_parking_location 설명',
  })
  public visit_parking_location: string;

  @Column()
  @ApiProperty({
    example: 'visit_parking_location_detail 예시',
    description: 'visit_parking_location_detail 설명',
  })
  public visit_parking_location_detail: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: 'modified_at 예시', description: 'modified_at 설명' })
  public modified_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ example: 'deleted_at 예시', description: 'deleted_at 설명' })
  public deleted_at: Date;

  @OneToMany(() => Reviews, (reviews) => reviews.appointment)
  public reviews: Reviews[];

  @ManyToOne(() => Customers, (customers) => customers.appointments)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customers;

  @ManyToOne(() => Business, (business) => business.appointments)
  @JoinColumn({ name: 'business_id' })
  public business: Business;

  @ManyToOne(() => Drivers, (drivers) => drivers.appointments)
  @JoinColumn({ name: 'driver_id' })
  public driver: Drivers;

  @ManyToOne(() => Pets, (pets) => pets.appointments)
  @JoinColumn({ name: 'pet_id' })
  public pet: Pets;

  @ManyToOne(
    () => Service_options,
    (service_options) => service_options.appointments,
  )
  @JoinColumn({ name: 'service_option_id' })
  public service_option: Service_options;
}
