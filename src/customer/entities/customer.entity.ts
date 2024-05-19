import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Point } from 'typeorm';

export enum AuthProvider {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
}

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  customerId: number;

  @Column({ type: 'char', length: 20, unique: true, nullable: false })
  uuid: string;

  @Column({ length: 30, nullable: false })
  customerName: string;

  @Column({ length: 20, nullable: true })
  customerPhoneNumber: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  customerLocation: Point;

  @Column({ type: 'enum', enum: AuthProvider, nullable: false })
  authProvider: AuthProvider;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  modifiedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
