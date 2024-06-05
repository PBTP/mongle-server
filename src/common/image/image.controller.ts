import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";
import { ImageService } from './image.service';
import { CurrentCustomer } from '../../auth/decorator/customer.decorator';
import { Customer } from '../../customer/entities/customer.entity';
import { AuthGuard } from '@nestjs/passport';
import { MetaData } from './dto/image.dto';

@Controller('/v1/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/presigned-url')
  @UseGuards(AuthGuard())
  @HttpCode(201)
  async getPreSignedUrl(
    @CurrentCustomer() customer: Customer,
    @Query() metadata: MetaData,
  ): Promise<{ url: string }> {
    return {
      url: await this.imageService.generatePreSignedUrl(
        customer.uuid,
        metadata,
        metadata.expiredTime,
      ),
    };
  }
}
