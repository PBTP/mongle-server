import { Exclude } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CursorDto<T> {
  @IsNumber()
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  cursor?: number;

  @IsNumber()
  @IsOptional()
  @Exclude({ toPlainOnly: true })
  limit?: number = 20;

  @IsOptional()
  @Exclude({ toClassOnly: true })
  next: number = 0;

  @IsOptional()
  @Exclude({ toClassOnly: true })
  data?: T[];
}
