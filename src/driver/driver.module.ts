import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../schemas/drivers.entity';
import { DriverService } from './application/driver.service';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],
  exports: [DriverService],
  providers: [DriverService],
})
export class DriverModule {}
