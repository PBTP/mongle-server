import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Business } from './business.entity';
import { Customers } from './customers.entity';

@Entity()
export class Favorites {
  @Column({ primary: true, unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @ManyToOne(() => Customers, (customers) => customers.favorites)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customers;

  @ManyToOne(() => Business, (business) => business.favorites)
  @JoinColumn({ name: 'business_id' })
  public business: Business;
}
