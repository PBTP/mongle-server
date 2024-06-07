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

@Controller('/v1/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/presigned-url')
  @UseGuards(AuthGuard())
  @HttpCode(201)
  async getPreSignedUrl(
    @CurrentCustomer() customer: Customer,
    @Body() metadata: MetaData[],
  ): Promise<{ url: string }[]> {
    return await this.imageService
      .generatePreSignedUrl(customer.uuid, metadata)
      .then((urls) => urls.map((url) => ({ url })));
  }
}
