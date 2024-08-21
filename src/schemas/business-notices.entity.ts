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
import { HasUuid } from '../common/entity/parent.entity';

@Entity({ name: 'business_notices', orderBy: { createdAt: 'ASC' } })
export class BusinessNotice extends HasUuid {
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
