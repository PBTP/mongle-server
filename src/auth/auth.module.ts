import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [CustomerService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
