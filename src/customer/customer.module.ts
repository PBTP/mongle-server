import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './application/customer.service';
import { CustomerEntity } from '../schemas/customer.entity';
import { CustomerController } from './presentation/customer.controller';
import {
  CUSTOMER_REPOSITORY,
  CustomerRepository,
} from './port/customer.repository';
import { UUID_HOLDER, UUIDHolder } from '../common/holder/uuid.holders';
import { DATE_HOLDER, DateHolder } from '../common/holder/date.holder';
import {
  SECURITY_SERVICE,
  SecurityService,
} from '../auth/application/security.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
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
    {
      provide: SECURITY_SERVICE,
      useClass: SecurityService,
    },
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
