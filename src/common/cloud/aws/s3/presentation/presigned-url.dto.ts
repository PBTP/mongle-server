import { ApiProperty } from '@nestjs/swagger';
import { TImageMetaDataDto } from '../../../../image/presentation/image.dto';

export type TPresignedUrlDto = TImageMetaDataDto & {
  url: string;
  expiredTime: number;
};

export class PresignedUrlDto implements TPresignedUrlDto {
  @ApiProperty({
    description:
      '파일의 크기는 Byte 단위로 전달합니다.\n' + '최대 크기는 10MB입니다.',
  })
  fileSize: number;
  @ApiProperty({
    description:
      '확장자까지 포함된 파일 이름입니다.\n' +
      '확장자를 포함하지 않은 파일 이름은 불가능합니다.',
  })
  fileName: string;

  @ApiProperty({
    description:
      '해당 프로퍼티를 통하여 presignedUrl의 만료 시간을 조정할 수 있습니다\n' +
      '기본값은 60초입니다.',
  })
  expiredTime: number = 60;

  @ApiProperty({
    description: 'presigned URL',
  })
  url: string;
}
