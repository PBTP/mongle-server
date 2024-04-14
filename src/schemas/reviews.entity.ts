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
import { ApiProperty } from '@nestjs/swagger';
import { Appointments } from './appointments.entity';
import { Business } from './business.entity';
import { Customers } from './customers.entity';
import { Pets } from './pets.entity';

@Entity()
export class Reviews {
  @PrimaryColumn()
  @ApiProperty({ example: 'review_id 예시', description: 'review_id 설명' })
  public review_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column()
  @ApiProperty({ example: 'rating 예시', description: 'rating 설명' })
  public rating: number;

  @Column()
  @ApiProperty({ example: 'content 예시', description: 'content 설명' })
  public content: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: 'modified_at 예시', description: 'modified_at 설명' })
  public modified_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ example: 'deleted_at 예시', description: 'deleted_at 설명' })
  public deleted_at: Date;

  @ManyToOne(() => Appointments, (appointments) => appointments.reviews)
  @JoinColumn({ name: 'appointment_id' })
  public appointment: Appointments;

  @ManyToOne(() => Customers, (customers) => customers.reviews)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customers;

  @ManyToOne(() => Business, (business) => business.reviews)
  @JoinColumn({ name: 'business_id' })
  public business: Business;

  @ManyToOne(() => Pets, (pets) => pets.reviews)
  @JoinColumn({ name: 'pet_id' })
  public pet: Pets;
}
