import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';
import { TermCategory, TermEntity } from '../../schemas/terms.entity';
import { Expose } from 'class-transformer';
import { Builder } from 'builder-pattern';
import { Term } from '../terms.domain';

type TermType = {
  get version(): number;
  set version(value: number);
  get title(): string;
  set title(value: string);
  get description(): string;
  set description(value: string);
  get isMandatory(): boolean;
  set isMandatory(value: boolean);
  get termCategory(): TermCategory;
  set termCategory(value: TermCategory);
};

export class BaseTermDto implements TermType {
  @ApiProperty({
    description: '약관 버전',
    required: true,
  })
  @IsNumber()
  private _version: number;

  @ApiProperty({
    description: '약관명',
    required: true,
  })
  private _title: string;

  @ApiProperty({
    description: '약관 내용',
    required: true,
  })
  private _description: string;

  @ApiProperty({
    description: '필수 여부',
    required: true,
  })
  @IsBoolean()
  private _isMandatory: boolean = false;

  @ApiProperty({
    description: '관련 기능',
    required: true,
  })
  private _termCategory: TermCategory;

  @Expose()
  get version(): number {
    return this._version;
  }

  set version(value: number) {
    this._version = value;
  }

  @Expose()
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  @Expose()
  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  @Expose()
  get isMandatory(): boolean {
    return this._isMandatory;
  }

  set isMandatory(value: boolean) {
    this._isMandatory = value;
  }

  @Expose()
  get termCategory(): TermCategory {
    return this._termCategory;
  }

  set termCategory(value: TermCategory) {
    this._termCategory = value;
  }

  // Entity → DTO
  static fromEntity<T extends BaseTermDto>(term: TermEntity, dtoType: new () => T): T {
    const dto = Object.assign(new dtoType(), {
      version: term.version,
      title: term.title,
      description: term.description,
      isMandatory: term.isMandatory,
      termCategory: term.termCategory
    });
    if (dto instanceof TermDto) (dto as TermDto).termId = term.termId;
    return dto;
  }

  // DTO → Domain
  toModel(): Term {
    const term = Builder(Term)
      .version(this.version)
      .title(this.title)
      .description(this.description)
      .isMandatory(this.isMandatory)
      .termCategory(this.termCategory)
      .build();
    if (this instanceof TermDto) term.termId = (this as TermDto).termId;
    return term;
  }

  // Domain → DTO
  static from(term: Term): BaseTermDto {
    return Builder(BaseTermDto)
      .version(term.version)
      .title(term.title)
      .description(term.description)
      .isMandatory(term.isMandatory)
      .termCategory(term.termCategory)
      .build();
  }
}

export class CreateTermDto extends BaseTermDto { }

export class TermDto extends BaseTermDto {
  @ApiProperty({
    description: '약관 ID',
    required: true,
    readOnly: true,
  })
  @IsNumber()
  private _termId: number;

  @Expose()
  get termId(): number {
    return this._termId;
  }

  set termId(value: number) {
    this._termId = value;
  }

  static override from(term: Term): TermDto {
    return Builder(TermDto)
      .termId(term.termId)
      .version(term.version)
      .title(term.title)
      .description(term.description)
      .isMandatory(term.isMandatory)
      .termCategory(term.termCategory)
      .build();
  }
}



