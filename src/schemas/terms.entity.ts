import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerTermEntity } from './customer-terms.entity';

export enum TermCategory {
  SERVICE = 'SERVICE', // 서비스 이용
  PRIVACY = 'PRIVACY', // 개인정보
  MARKETING = 'MARKETING', // 마케팅 수신
  LOCATION = 'LOCATION', // 위치 정보
}

@Entity({ name: 'terms' })
export class TermEntity {
  @PrimaryColumn()
  public termId: number;

  @Column()
  public version: number;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public isMandatory: boolean = false;

  @Column({
    type: 'enum',
    enum: TermCategory,
    default: TermCategory.SERVICE,
  })
  public termCategory: string;

  @CreateDateColumn()
  public createdAt?: Date;

  @UpdateDateColumn()
  public modifiedAt?: Date;

  @DeleteDateColumn()
  public deletedAt?: Date;

  @OneToMany(() => CustomerTermEntity, (customerTerm) => customerTerm.term)
  public customerTerms: CustomerTermEntity[];
}
