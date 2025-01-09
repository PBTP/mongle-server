import {UserDto} from '../../auth/presentation/user.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {DriverEntity} from '../../schemas/drivers.entity';
import {Repository} from 'typeorm';
import {AuthDto} from '../../auth/presentation/auth.dto';
import {Injectable} from '@nestjs/common';

export const DRIVER_REPOSITORY = Symbol('DRIVER_REPOSITORY');

export interface IDriverRepository {
  getOne(driverId: UserDto): Promise<DriverEntity>;
  findOne(driverId: UserDto): Promise<DriverEntity | null>;
  save(driver: DriverEntity): Promise<DriverEntity>;
  create(dto: UserDto): DriverEntity;
}

@Injectable()
export class DriverRepository implements IDriverRepository {
  constructor(
    @InjectRepository(DriverEntity)
    private readonly driverRepository: Repository<DriverEntity>,
  ) {}

  async getOne(dto: AuthDto): Promise<DriverEntity> {
    return await this.driverRepository.findOneOrFail({
      where: {
        driverId: dto.userId,
        uuid: dto.uuid,
        refreshToken: dto.refreshToken,
      },
    });
  }
  async findOne(dto: AuthDto): Promise<DriverEntity | null> {
    return await this.driverRepository.findOne({
      where: {
        driverId: dto.userId,
        uuid: dto.uuid,
        refreshToken: dto.refreshToken,
      },
    });
  }

  create(dto: UserDto): DriverEntity {
    return this.driverRepository.create(dto);
  }

  save(driver: DriverEntity): Promise<DriverEntity> {
    return this.driverRepository.save(driver);
  }
}
