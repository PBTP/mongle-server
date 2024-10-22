import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { Business } from './business.entity';
import { HasUuid } from '../common/entity/parent.entity';

export type TBusinessNotice = {
  businessNoticeId: number;
  title: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
  business: Business;
};

@Entity({ name: 'business_notices', orderBy: { createdAt: 'ASC' } })
export class BusinessNotice extends HasUuid implements TBusinessNotice {
  @PrimaryColumn()
  public businessNoticeId: number;

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
