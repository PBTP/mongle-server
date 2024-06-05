import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { CloudModule } from '../cloud/cloud.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CloudModule],
  exports: [ImageService],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
