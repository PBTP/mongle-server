import { IsNotEmpty, IsNumber, IsOptional, Matches, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class ImageDto {
  uuid: string;
  imageUrl: string;
  createdAt: Date;
}

export class ImageMetaDataDto {
  @ApiProperty({
    description:
      '파일의 크기는 Byte 단위로 전달합니다.\n' + '최대 크기는 10MB입니다.',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Max(10 * 1024 * 1024)
  fileSize: number;

  @ApiProperty({
    description:
      '확장자까지 포함된 파일 이름입니다.\n' +
      '확장자를 포함하지 않은 파일 이름은 불가능합니다.',
  })
  @Matches(/\.(jpg|jpeg|png|gif|svg)$/i, {
    message:
      'The file extension must be one of the following: jpg, jpeg, png, gif, svg',
  })
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description:
      '해당 프로퍼티를 통하여 presignedUrl의 만료 시간을 조정할 수 있습니다\n' +
      '기본값은 60초입니다.',
    required: false,
  })
  @IsOptional()
  expiredTime?: number = 60;
}
