import { Module } from '@nestjs/common';
import { TestController } from './presentation/test.controller';
import { TestService } from './application/test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../schemas/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Entity
      Customer,
    ]),
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [],
})
export class TestModule {}
