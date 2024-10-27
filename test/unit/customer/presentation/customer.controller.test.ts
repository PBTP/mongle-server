import { CustomerService } from '../../../../src/customer/application/customer.service';
import { CustomerController } from '../../../../src/customer/presentation/customer.controller';
import { FakeCustomerRepository } from '../../../mock/fake.customer.repository';
import { SecurityService } from '../../../../src/auth/application/security.service';
import { ImageService } from '../../../../src/common/image/application/image.service';
import { FakeCloudStorageService } from '../../../mock/fake.cloud-storage.service';
import { FakeImageRepository } from '../../../mock/fake.image.repository';
import { FakeDateHolder, FakeUuidHolder } from '../../../mock/fake.holder';
import { ConfigService } from '@nestjs/config';
import { FakeConfigService } from '../../../mock/fake.config.service';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let configService: ConfigService;
  const date = new Date();

  beforeEach(async () => {
    configService = new FakeConfigService();

    const customerService = new CustomerService(
      new FakeCustomerRepository(),
      new SecurityService(configService),
      new ImageService(
        new FakeCloudStorageService(),
        new FakeImageRepository(),
      ),
      new FakeUuidHolder('test-uuid'),
      new FakeDateHolder(date),
    );
    customerController = new CustomerController(customerService);
  });

  describe('Create', () => {
    // TODO: Implement test
  });
});
