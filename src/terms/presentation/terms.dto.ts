import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';
import { TermCategory, TermEntity } from '../../schemas/terms.entity';
import { Expose } from 'class-transformer';

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

export class TermDto implements TermType {
  @ApiProperty({
    description: '약관 버전',
    required: true,
  })
  @IsNumber()
  @Expose()
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
  @Expose()
  private _description: string;

  @ApiProperty({
    description: '필수 여부',
    required: true,
  })
  @IsBoolean()
  @Expose()
  private _isMandatory: boolean = false;

  @ApiProperty({
    description: '관련 기능',
    required: true,
  })
  @Expose()
  private _termCategory: TermCategory;

  get version(): number {
    return this._version;
  }

  set version(value: number) {
    this._version = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get isMandatory(): boolean {
    return this._isMandatory;
  }

  set isMandatory(value: boolean) {
    this._isMandatory = value;
  }

  get termCategory(): TermCategory {
    return this._termCategory;
  }

  set termCategory(value: TermCategory) {
    this._termCategory = value;
  }

  static from<T extends TermDto>(term: TermEntity, dtoType: new () => T): T {
    const dto = Object.assign(new dtoType(), {
      version: term.version,
      title: term.title,
      description: term.description,
      isMandatory: term.isMandatory,
      termCategory: term.termCategory
    });
    if (dto instanceof UpdateTermDto) {
      (dto as UpdateTermDto).termId = term.termId;
    } return dto;
  }
}

export class CreateTermDto extends TermDto { }

export class UpdateTermDto extends TermDto {
  @ApiProperty({
    description: '약관 ID',
    required: true,
    readOnly: true,
  })
  @IsNumber()
  private _termId: number;

  get termId(): number {
    return this._termId;
  }

  set termId(value: number) {
    this._termId = value;
  }
}



