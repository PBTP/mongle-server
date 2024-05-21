import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Point } from 'typeorm';
import { AuthProvider } from '../entities/customer.entity';

export class CustomerDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  customerName: string;

  @IsOptional()
  customerPhoneNumber: string;

  @IsOptional()
  customerLocation: Point;

  @IsNotEmpty()
  @IsEnum(AuthProvider)
  authProvider: AuthProvider;

  @IsOptional()
  refreshToken: string;
}
