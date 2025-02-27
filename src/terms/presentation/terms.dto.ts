import { ApiProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsBoolean, IsNumber } from 'class-validator';
import { TermEntity } from '../../schemas/terms.entity';

export class TermDto {
  @ApiProperty({
    description: '약관 ID',
    required: true,
    readOnly: true,
  })
  @IsNumber()
  public termId?: number;

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
  public termCategory: string;

  static from(term: TermEntity): TermDto {
    return Builder(TermDto)
      .termId(term.termId)
      .title(term.title)
      .description(term.description)
      .version(term.version)
      .isMandatory(term.isMandatory)
      .termCategory(term.termCategory)
      .build();
  }
}
