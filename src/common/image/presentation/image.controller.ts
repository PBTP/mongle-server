import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ImageService } from '../application/image.service';
import { CurrentCustomer } from '../../../auth/decorator/customer.decorator';
import { AuthGuard } from '@nestjs/passport';
import { MetaData } from './image.dto';
import { Customer } from '../../../schemas/customers.entity';
import { PresignedUrlDto } from "../../cloud/aws/s3/presentation/presigned-url.dto";

@Controller('/v1/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/presigned-url')
  @UseGuards(AuthGuard())
  @HttpCode(201)
  async getPreSignedUrl(
    @CurrentCustomer() customer: Customer,
    @Body() metadata: MetaData[],
  ): Promise<PresignedUrlDto[]> {
    return await this.imageService
      .generatePreSignedUrls(customer.uuid, metadata)
      .then((dtos) => dtos.map((v) => {
        return {
          url: v.url,
          expiredTime: v.expiredTime,
        };
      }));
  }
}
