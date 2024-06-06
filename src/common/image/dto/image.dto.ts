import { IsNotEmpty, IsNumber, IsOptional, Max, MAX, MaxLength } from "class-validator";
import { Exclude, Transform, Type } from "class-transformer";

export class ImageDto {
  uuid: string;
  imageLink: string;
  createdAt: Date;
}

export class MetaData {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Max(10 * 1024 * 1024)
  fileSize: number;

  @IsNotEmpty()
  fileName: string;

  @IsOptional()
  expiredTime: number = 60;
}
