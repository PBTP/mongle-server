import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './application/image.service';
import { ImageController } from './presentation/image.controller';
import { Image } from '../../schemas/image.entity';
import { ImageConsumer } from './application/image.consumer';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  exports: [ImageService, ImageConsumer],
  providers: [ImageService, ImageConsumer],
  controllers: [ImageController],
})
export class ImageModule {}
