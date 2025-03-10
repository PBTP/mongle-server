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
  public modifiedAt?: Date;

  @DeleteDateColumn()
  public deletedAt?: Date;

  @OneToMany(() => CustomerTermEntity, (customerTerm) => customerTerm.term)
  public customerTerms: CustomerTermEntity[];

  toModel(): Term {
    return Term.from(this);
  }

  // static create(dto: CreateTermDto): TermEntity {
  //   // TypeORM) Builder가 아닌 new Entity()를 사용하여 자동 생성 필드 termId, date 처리 보장
  //   const entity = new TermEntity();
  //   entity.title = dto.title;
  //   entity.description = dto.description;
  //   entity.version = dto.version;
  //   entity.termCategory = dto.termCategory;
  //   entity.isMandatory = dto.isMandatory;
  //   return entity;
  // }
}
