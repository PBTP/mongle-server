import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';
import { CustomerModule } from '../customer/customer.module';
import { BusinessModule } from '../business/business.module';
import { DriverModule } from '../driver/driver.module';

@Module({
  imports: [CustomerModule, BusinessModule, DriverModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
