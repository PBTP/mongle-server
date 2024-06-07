import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './application/image.service';
import { ImageController } from './presentation/image.controller';
import { Images } from '../../schemas/image.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Images])],
  exports: [ImageService],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
