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
import { PetSize } from 'src/domain/service-option/enums/pet-size.enum';

@Entity()
export class Service_options {
  @PrimaryColumn()
  @ApiProperty({
    example: 'service_option_id 예시',
    description: 'service_option_id 설명',
  })
  public service_option_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column()
  @ApiProperty({
    example: 'service_option_description 예시',
    description: 'service_option_description 설명',
  })
  public service_option_description: string;

  @Column()
  @ApiProperty({
    example: 'service_option_price 예시',
    description: 'service_option_price 설명',
  })
  public service_option_price: string;

  @Column({
    type: 'enum',
    enum: PetSize,
    default: PetSize.SMALL,
  })
  @ApiProperty({ example: 'pet_size 예시', description: 'pet_size 설명' })
  public pet_size: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: 'modified_at 예시', description: 'modified_at 설명' })
  public modified_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ example: 'deleted_at 예시', description: 'deleted_at 설명' })
  public deleted_at: Date;

  @OneToMany(() => Appointments, (appointments) => appointments.service_option)
  public appointments: Appointments[];

  @ManyToOne(() => Business, (business) => business.service_options)
  @JoinColumn({ name: 'business_id' })
  public business: Business;
}
