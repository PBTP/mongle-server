import { Inject, Injectable, Logger } from '@nestjs/common';
import { DriverEntity } from "@schemas/drivers.entity";
import { IUserService } from "@auth/user.interface";
import { UserDto, UserType } from "@auth/presentation/user.dto";
import { AuthDto } from "@auth/presentation/auth.dto";
import {
  DRIVER_REPOSITORY,
  IDriverRepository,
} from '../port/driver.repository';

@Injectable()
export class DriverService implements IUserService {
  private readonly logger = new Logger(DriverService.name);

  readonly userType: UserType = 'driver';

  constructor(
    @Inject(DRIVER_REPOSITORY)
    private readonly driverRepository: IDriverRepository,
  ) {}

  async signUp(dto: DriverEntity): Promise<DriverEntity> {
    const newDriver = this.driverRepository.create(dto);
    return await this.driverRepository.save(newDriver);
  }

  async getOne(dto: Partial<AuthDto>): Promise<DriverEntity> {
    return await this.driverRepository.getOne(dto);
  }
  async findOne(dto: Partial<AuthDto>): Promise<DriverEntity | null> {
    return await this.driverRepository.findOne(dto);
  }

  async create(dto: UserDto): Promise<DriverEntity> {
    return await this.driverRepository
      .save(this.driverRepository.create(dto))
      .then((driver) => {
        this.logger.log(
          `Create new driver id:${driver.driverId}, name:${driver.driverName}`,
        );
        return driver;
      });
  }

  async update(dto: AuthDto): Promise<DriverEntity> {
    return this.getOne(dto).then(async (driver) => {
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

  toUserDto(driver: DriverEntity): UserDto {
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
