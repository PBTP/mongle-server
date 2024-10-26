import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../../schemas/drivers.entity';
import { Repository } from 'typeorm';
import { IUserService } from '../../auth/user.interface';
import { UserDto, UserType } from '../../auth/presentation/user.dto';
import { AuthDto } from '../../auth/presentation/auth.dto';

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

  async findOne(dto: Partial<AuthDto>): Promise<Driver> {
    return await this.driverRepository.findOneOrFail({
      where: {
        driverId: dto.userId,
        uuid: dto.uuid,
        refreshToken: dto.refreshToken,
      },
    });
  }

  async create(dto: UserDto): Promise<Driver> {
    return await this.driverRepository
      .save(this.driverRepository.create(dto))
      .then((driver) => {
        this.logger.log(
          `Create new driver id:${driver.driverId}, name:${driver.driverName}`,
        );
        return driver;
      });
  }

  async update(dto: AuthDto): Promise<Driver> {
    return this.findOne(dto).then(async (driver) => {
      if (dto.name) {
        driver.driverName = dto.name;
      }
      if (dto.phoneNumber) {
        driver.driverPhoneNumber = dto.phoneNumber;
      }
      driver.refreshToken = dto.refreshToken ?? driver.refreshToken;

      return await this.driverRepository.save(driver);
    });
  }

  toUserDto(driver: Driver): UserDto {
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
