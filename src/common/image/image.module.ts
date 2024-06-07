import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './application/image.service';
import { ImageController } from './presentation/image.controller';
import { Images } from '../../schemas/image.entity';
import { ImageConsumer } from "./application/image.consumer";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Images])],
  exports: [ImageService, ImageConsumer],
  providers: [ImageService, ImageConsumer],
  controllers: [ImageController],
})
export class ImageModule {}
