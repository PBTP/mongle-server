import { ApiProperty } from "@nestjs/swagger";
import { ImageMetaDataDto } from "../../../../image/presentation/image.dto";

export class PresignedUrlDto extends ImageMetaDataDto {
  @ApiProperty({
    description: 'presigned URL',
  })
  url: string;
  @ApiProperty({
    description:
      'presignedUrl은 유효시간이 따로 존재합니다.\n' +
      '해당 시간이 초과된 경우 403 Code를 반환합니다.',
  })
  expiredTime: number;
}
