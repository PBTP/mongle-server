import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerService } from "./application/customer.service";
import { Customer } from "../schemas/customer.entity";
import { CustomerController } from "./presentation/customer.controller";
import { SecurityModule } from "../auth/application/security.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    SecurityModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
