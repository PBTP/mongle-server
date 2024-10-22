import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './application/customer.service';
import { CustomerEntity } from '../schemas/customer.entity';
import { CustomerController } from './presentation/customer.controller';
import { SecurityModule } from '../auth/application/security.module';
import { CUSTOMER_REPOSITORY, CustomerRepository } from './port/customer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    SecurityModule
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: CUSTOMER_REPOSITORY,
      useValue: CustomerRepository
    }
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
