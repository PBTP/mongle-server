import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver, TDriver } from '../../schemas/drivers.entity';
import { Repository } from 'typeorm';
import { IUserService } from '../../auth/user.interface';
import { TUserDto, UserType } from '../../auth/presentation/user.dto';
import { TAuthDto } from '../../auth/presentation/auth.dto';

@Injectable()
export class DriverService implements IUserService {
  private readonly logger = new Logger(DriverService.name);

  readonly userType: UserType = 'driver';

  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async signUp(dto: Driver): Promise<Driver> {
    const newDriver = this.driverRepository.create(dto);
    return await this.driverRepository.save(newDriver);
  }

  async findOne(dto: Partial<TAuthDto>): Promise<Driver> {
    const where = {};

    dto.userId && (where['driverId'] = dto.userId);
    dto.uuid && (where['uuid'] = dto.uuid);
    dto.refreshToken && (where['refreshToken'] = dto.refreshToken);

    return await this.driverRepository.findOne({
      where: where,
    });
  }

  async create(dto: TUserDto): Promise<Driver> {
    return await this.driverRepository
      .save(this.driverRepository.create(dto))
      .then((driver) => {
        this.logger.log(
          `Create new driver id:${driver.driverId}, name:${driver.driverName}`,
        );
        return driver;
      });
  }

  async update(dto: TAuthDto): Promise<Driver> {
    return this.findOne(dto).then(async (driver) => {
      if (driver) {
        driver.driverName = dto.name;
        driver.driverPhoneNumber = dto.phoneNumber;
        driver.refreshToken = dto.refreshToken ?? driver.refreshToken;

        return await this.driverRepository.save(driver);
      }
    });
  }

  toUserDto(driver: TDriver): TUserDto {
    return {
      uuid: driver.uuid,
      name: driver.driverName,
      userId: driver.driverId,
      userType: this.userType,
      phoneNumber: driver.driverPhoneNumber,
      authProvider: driver.authProvider,
    };
  }
}
