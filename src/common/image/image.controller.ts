import { Controller, Get, UseGuards } from '@nestjs/common';
import { ImageService } from './image.service';
import { CurrentCustomer } from '../../auth/decorator/customer.decorator';
import { Customer } from '../../customer/entities/customer.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('/v1/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/presigned-url')
  @UseGuards(AuthGuard())
  async getPreSignedUrl(
    @CurrentCustomer() customer: Customer,
    metadata: { ContentType: string; ContentLength: number; extension: string },
  ): Promise<string> {
    return this.imageService.generatedPreSignedUrl(customer.uuid, metadata, 60);
  }
}
