import { IsNotEmpty, IsOptional, IsEnum, Length } from 'class-validator';
import { Point } from 'typeorm';
import { AuthProvider } from '../entities/customer.entity';

export class CustomerDto {
  @IsNotEmpty()
  @Length(1, 20)
  uuid: string;

  @IsNotEmpty()
  @Length(1, 30)
  customerName: string;

  @IsOptional()
  @Length(1, 30)
  customerPhoneNumber: string;

  @IsOptional()
  customerLocation: Point;

  @IsNotEmpty()
  @IsEnum(AuthProvider)
  authProvider: AuthProvider;

  @IsOptional()
  refreshToken: string;
}
