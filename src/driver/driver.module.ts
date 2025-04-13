import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from "@schemas/drivers.entity";
import { DriverService } from './application/driver.service';
import { DRIVER_REPOSITORY, DriverRepository } from './port/driver.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity])],
  exports: [DriverService],
  providers: [
    {
      provide: DRIVER_REPOSITORY,
      useClass: DriverRepository,
    },
    DriverService,
  ],
})
export class DriverModule {}
