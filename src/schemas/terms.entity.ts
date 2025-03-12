import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateTermDto, TermDto } from '../terms/presentation/terms.dto';
import { CustomerTermEntity } from './customer-terms.entity';
import { Term } from 'src/terms/terms.domain';
import { Builder } from 'builder-pattern';
import { title } from 'process';

export enum TermCategory {
  SERVICE = 'SERVICE', // 서비스 이용
  PRIVACY = 'PRIVACY', // 개인정보
  MARKETING = 'MARKETING', // 마케팅 수신
  LOCATION = 'LOCATION', // 위치 정보
}

@Entity({ name: 'terms' })
export class TermEntity {
  @PrimaryGeneratedColumn()
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
  public termCategory: TermCategory;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public modifiedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(() => CustomerTermEntity, (customerTerm) => customerTerm.term)
  public customerTerms: CustomerTermEntity[];

  toModel(): Term {
    return Term.from(this);
  }

  // Domain → Entity
  static from(domain: Term): TermEntity {
    return Builder(TermEntity)
      .termId(domain.termId)
      .version(domain.version)
      .title(domain.title)
      .description(domain.description)
      .isMandatory(domain.isMandatory)
      .termCategory(domain.termCategory)
      .build();
  }
}
