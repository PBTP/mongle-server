import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Point } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

export enum AuthProvider {
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
}

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  @Exclude({ toPlainOnly: true })
  customerId: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
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

  @Expose({ toPlainOnly: true })
  @Column({ type: 'enum', enum: AuthProvider, nullable: false })
  authProvider: AuthProvider;

  @Expose({ toPlainOnly: true })
  @Column({ length: 20, unique: true, nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  modifiedAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Exclude({ toPlainOnly: true })
  deletedAt?: Date;
}
