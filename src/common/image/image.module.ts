import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './application/image.service';
import { ImageController } from './presentation/image.controller';
import { ImageEntity } from '../../schemas/image.entity';
import { ImageConsumer } from './application/image.consumer';
import { IMAGE_REPOSITORY, ImageRepository } from './port/image.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  exports: [ImageService, ImageConsumer],

  providers: [
    ImageService,
    ImageConsumer,
    {
      provide: IMAGE_REPOSITORY,
      useValue: ImageRepository
    }
  ],
  controllers: [ImageController]
})
export class ImageModule {
}
