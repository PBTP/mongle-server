import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './application/customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerController } from './presentation/customer.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    PassportModule.register({ defaultStrategy: 'access' }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
