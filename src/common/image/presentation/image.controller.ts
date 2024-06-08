import {
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ImageService } from '../application/image.service';
import { CurrentCustomer } from '../../../auth/decorator/customer.decorator';
import { AuthGuard } from '@nestjs/passport';
import { MetaData } from './image.dto';
import { Customer } from '../../../schemas/customers.entity';
import { PresignedUrlDto } from '../../cloud/aws/s3/presentation/presigned-url.dto';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('이미지 관련 API')
@Controller('/v1/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiBody({
    type: [MetaData],
    description: '이미지에 대한 메타 데이터 입니다.',
  })
  @ApiQuery({
    name: 'key',
    required: false,
    description: '이미지 링크에 사용되는 key값입니다.',
  })
  @ApiOperation({
    summary: 'presignedUrl 발급 요청',
    description:
      'presignedUrl을 발급받아 이미지 업로드를 위한 URL을 제공합니다.\n' +
      '발급받은 url로 PUT 메소드로 이미지를 전송하면 S3에 이미지가 게시됩니다.' +
      '이미지 업로드시에는 Body에 Binary로 이미지를 전송해야 합니다.',
  })
  @ApiResponse({
    status: 201,
    type: [PresignedUrlDto],
    description: 'Generated presigned URL',
  })
  @Post('/presigned-url')
  @UseGuards(AuthGuard())
  @HttpCode(201)
  async getPreSignedUrl(
    @CurrentCustomer() customer: Customer,
    @Query('key') key: string,
    @Body() metadata: MetaData[],
  ): Promise<PresignedUrlDto[]> {
    return await this.imageService
      .generatePreSignedUrls(key ?? customer.uuid, metadata)
      .then((dtos) =>
        dtos.map((v) => {
          return {
            url: v.url,
            expiredTime: v.expiredTime,
          };
        }),
      );
  }
}
