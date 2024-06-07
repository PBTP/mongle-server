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
import { Business } from './business.entity';

@Entity({ name: 'business_notices' })
export class BusinessNotice {
  @PrimaryColumn()
  public businessNoticeId: number;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public modifiedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @ManyToOne(() => Business, (business) => business.businessNotices)
  @JoinColumn({ name: 'business_id' })
  public business: Business;
}
