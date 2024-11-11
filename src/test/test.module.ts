import { Module } from '@nestjs/common';
import { TestController } from './presentation/test.controller';
import { TestService } from './application/test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../schemas/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Entity
      CustomerEntity,
    ]),
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [],
})
export class TestModule {}
