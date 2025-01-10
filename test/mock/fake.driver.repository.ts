import { UserDto } from 'src/auth/presentation/user.dto';
import { IDriverRepository } from '../../src/driver/port/driver.repository';
import { DriverEntity } from '../../src/schemas/drivers.entity';
import { AuthDto } from '../../src/auth/presentation/auth.dto';

export class FakeDriverRepository implements IDriverRepository {
  private readonly drivers: DriverEntity[] = [];

  getOne(user: AuthDto): Promise<DriverEntity> {
    if (!user.userId && !user.uuid && !user.refreshToken) {
      throw new Error('Driver를 찾을 수 없습니다.');
    }
    const findDriver = this.drivers.find((driver) => {
      return (
        driver.driverId === user.userId ||
        driver.uuid === user.uuid ||
        driver.refreshToken === user.refreshToken
      );
    });

    if (!findDriver) {
      throw new Error('Driver not found');
    }
    return Promise.resolve(findDriver);
  }

  findOne(user: AuthDto): Promise<DriverEntity | null> {
    if (!user.userId && !user.uuid && !user.refreshToken) {
      throw new Error('Driver를 찾을 수 없습니다.');
    }
    const findDriver = this.drivers.find((driver) => {
      return (
        driver.driverId === user.userId ||
        driver.uuid === user.uuid ||
        driver.refreshToken === user.refreshToken
      );
    });
    return Promise.resolve(findDriver ?? null);
  }

  save(driver: DriverEntity): Promise<DriverEntity> {
    if (!driver.driverName || !driver.authProvider) {
      throw new Error('필수 정보가 누락되었습니다.');
    }

    let findDriver = this.drivers.find(
      (c) => c.uuid === driver.uuid || c.driverId === driver.driverId,
    );

    if (findDriver) {
      findDriver = driver;
      return Promise.resolve(findDriver);
    } else {
      driver.driverId = this.drivers.length + 1;
      return Promise.resolve(driver);
    }
  }
  create: (dto: UserDto) => DriverEntity;
}
