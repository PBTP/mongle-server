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
import { Appointments } from './appointments.entity';
import { Business } from './business.entity';
import { Driver_chats } from './driver-chats.entity';

@Entity()
export class Drivers {
  @PrimaryColumn()
  @ApiProperty({ example: 'driver_id 예시', description: 'driver_id 설명' })
  public driver_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column()
  @ApiProperty({ example: 'driver_name 예시', description: 'driver_name 설명' })
  public driver_name: string;

  @Column()
  @ApiProperty({
    example: 'driver_phone_number 예시',
    description: 'driver_phone_number 설명',
  })
  public driver_phone_number: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: 'modified_at 예시', description: 'modified_at 설명' })
  public modified_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ example: 'deleted_at 예시', description: 'deleted_at 설명' })
  public deleted_at: Date;

  @OneToMany(() => Appointments, (appointments) => appointments.driver)
  public appointments: Appointments[];

  @OneToMany(() => Driver_chats, (driver_chats) => driver_chats.driver)
  public driver_chats: Driver_chats[];

  @ManyToOne(() => Business, (business) => business.drivers)
  @JoinColumn({ name: 'business_id' })
  public business: Business;
}
