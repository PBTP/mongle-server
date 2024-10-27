import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './application/customer.service';
import { CustomerEntity } from '../schemas/customer.entity';
import { CustomerController } from './presentation/customer.controller';
import { SecurityModule } from '../auth/application/security.module';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from './port/customer.repository';
import { UUID_HOLDER, UUIDHolder } from '../common/holder/uuid.holders';
import { DATE_HOLDER, DateHolder } from '../common/holder/date.holder';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), SecurityModule],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
    {
      provide: UUID_HOLDER,
      useClass: UUIDHolder,
    },
    {
      provide: DATE_HOLDER,
      useClass: DateHolder,
    },
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
