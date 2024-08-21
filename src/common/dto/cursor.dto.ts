import { Exclude } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CursorDto<T> {
  @ApiProperty({
    description:
      '커서 값입니다. \n' +
      '해당 커서값을 기준으로 limit만큼의 데이터를 조회합니다. ',
    required: false,
    nullable: true,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  cursor?: number;

  @ApiProperty({
    description:
      '조회할 데이터의 갯수입니다. \n' +
      'limit만큼의 데이터를 조회합니다.\n' +
      '기본값은 20입니다.',
    required: false,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  limit?: number = 20;

  @ApiProperty({
    description:
      '다음 페이지를 조회하기 위한 커서 값입니다. \n' +
      '해당 값을 cursor에 넣어 다음 페이지를 조회합니다.\n' +
      '더 이상 다음페이지가 존재하지 않으면 0으로 표기됩니다.',
    required: false,
    nullable: true,
    type: Number,
  })
  @IsOptional()
  @Exclude({ toClassOnly: true })
  next: number = 0;

  @IsOptional()
  @Exclude({ toClassOnly: true })
  data?: T[];
}
