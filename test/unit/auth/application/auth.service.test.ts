import { AuthService } from '../../../../src/auth/application/auth.service';
import { CustomerService } from '../../../../src/customer/application/customer.service';
import { FakeCustomerRepository } from '../../../mock/fake.customer.repository';
import { FakeSecurityService } from '../../../mock/fake.security.service';
import { ImageService } from '../../../../src/common/image/application/image.service';
import { FakeCloudStorageService } from '../../../mock/fake.cloud-storage.service';
import { FakeImageRepository } from '../../../mock/fake.image.repository';
import { UUIDHolder } from '../../../../src/common/holder/uuid.holders';
import { DateHolder } from '../../../../src/common/holder/date.holder';
import { JwtService } from '@nestjs/jwt';
import { FakeConfigService } from '../../../mock/fake.config.service';
import { FakeCacheService } from '../../../mock/fake.cache.service';
import { UserService } from '../../../../src/auth/application/user.service';
import { DriverService } from '../../../../src/driver/application/driver.service';
import { FakeDriverRepository } from '../../../mock/fake.driver.repository';
import { BusinessService } from '../../../../src/business/application/business.service';
import { FakeBusinessRepository } from '../../../mock/fake.business.repsitory';
import {
  AuthProvider,
  UserDto,
} from '../../../../src/auth/presentation/user.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const customerService = new CustomerService(
      new FakeCustomerRepository(),
      new FakeSecurityService(),
      new ImageService(
        new FakeCloudStorageService(),
        new FakeImageRepository(),
      ),
      new UUIDHolder(),
      new DateHolder(),
    );
    service = new AuthService(
      new JwtService(),
      new FakeConfigService(),
      new FakeCacheService(),
      new UserService(
        customerService,
        new DriverService(new FakeDriverRepository()),
        new BusinessService(new FakeBusinessRepository()),
      ),
    );
  });

  test('login', async () => {
    const initUser: UserDto = {
      userId: 1,
      userType: 'customer',
      name: '홍길동',
      authProvider: AuthProvider.BASIC,
    };

    const loginUser = await service.login(initUser);

    expect(loginUser).toBeDefined();
    expect(loginUser?.accessToken).toBeDefined();
    expect(loginUser?.refreshToken).toBeDefined();
  });
});
