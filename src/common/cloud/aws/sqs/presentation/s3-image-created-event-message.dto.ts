import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class S3Bucket {
  @IsString()
  @IsNotEmpty()
  name: string;
}

class S3Object {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsNotEmpty()
  etag: string;

  @IsString()
  @IsNotEmpty()
  sequencer: string;
}

class S3Detail {
  @IsString()
  @IsNotEmpty()
  version: string;

  @ValidateNested()
  @Type(() => S3Bucket)
  bucket: S3Bucket;

  @ValidateNested()
  @Type(() => S3Object)
  object: S3Object;

  @IsString()
  @IsNotEmpty()
  requester: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class S3EventDetailDto {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  account: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsArray()
  @IsString({ each: true })
  resources: string[];

  @ValidateNested()
  @Type(() => S3Detail)
  detail: S3Detail;
}
