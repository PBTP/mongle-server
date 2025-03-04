import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';
import { TermCategory, TermEntity } from '../../schemas/terms.entity';

type TermType = {
  version: number;
  title: string;
  description: string;
  isMandatory: boolean;
  termCategory: TermCategory;
};

export class TermDto implements TermType {
  @ApiProperty({
    description: '약관 버전',
    required: true,
  })
  @IsNumber()
  public version: number;

  @ApiProperty({
    description: '약관명',
    required: true,
  })
  public title: string;

  @ApiProperty({
    description: '약관 내용',
    required: true,
  })
  public description: string;

  @ApiProperty({
    description: '필수 여부',
    required: true,
  })
  @IsBoolean()
  public isMandatory: boolean = false;

  @ApiProperty({
    description: '관련 기능',
    required: true,
  })
  public termCategory: TermCategory;

  static from<T extends TermDto>(term: TermEntity, dtoType: new () => T): T {
    const dto = Object.assign(new dtoType(), {
      version: term.version,
      title: term.title,
      description: term.description,
      isMandatory: term.isMandatory,
      termCategory: term.termCategory
    });
    if (dto instanceof UpdateTermDto) (dto as UpdateTermDto).termId = term.termId;
    return dto;
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
  termId: number;
}



