import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../../schemas/drivers.entity';
import { Repository } from 'typeorm';
import { IUserService } from '../../auth/user.interface';
import { UserDto } from '../../auth/presentation/user.dto';

@Injectable()
export class DriverService implements IUserService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async signUp(dto: Driver): Promise<Driver> {
    const newDriver = this.driverRepository.create(dto);
    return await this.driverRepository.save(newDriver);
  }

  async findOne(dto: Partial<UserDto>): Promise<Driver> {
    const where = {};

    dto.userId && (where['driverId'] = dto.userId);
    dto.uuid && (where['uuid'] = dto.uuid);

    return await this.driverRepository.findOne({
      where: where,
    });
  }
}
