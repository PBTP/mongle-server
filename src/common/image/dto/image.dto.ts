import { IsNotEmpty, IsNumber } from 'class-validator';
import { Exclude } from 'class-transformer';

export class ImageDto {
  @IsNumber()
  @Exclude()
  imageId: number;
  uuid: string;
  imageLink: string;
  createdAt: Date;

  @IsNotEmpty()
  contentType: string;
  @IsNotEmpty()
  contentLength: number;
}
