import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Images } from './image.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Images])],
  exports: [ImageService],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
