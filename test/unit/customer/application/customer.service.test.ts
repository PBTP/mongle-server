import { CustomerService } from '../../../../src/customer/application/customer.service';
import { ConfigService } from '@nestjs/config';
import { FakeConfigService } from '../../../mock/fake.config.service';
import { FakeCustomerRepository } from '../../../mock/fake.customer.repository';
import { SecurityService } from '../../../../src/auth/application/security.service';
import { ImageService } from '../../../../src/common/image/application/image.service';
import { FakeCloudStorageService } from '../../../mock/fake.cloud-storage.service';
import { FakeImageRepository } from '../../../mock/fake.image.repository';
import { CustomerDto } from '../../../../src/customer/presentation/customer.dto';
import { Builder } from 'builder-pattern';
import { AuthProvider } from '../../../../src/auth/presentation/user.dto';
import { FakeDateHolder, FakeUuidHolder } from '../../../mock/fake.holder';
import { PresignedUrlDto } from '../../../../src/common/cloud/aws/s3/presentation/presigned-url.dto';

describe('CustomerService', () => {
  let service: CustomerService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new FakeConfigService();

    const date = new Date();
    service = new CustomerService(
      new FakeCustomerRepository(),
      new SecurityService(configService),
      new ImageService(
        new FakeCloudStorageService(),
        new FakeImageRepository(),
      ),
      new FakeUuidHolder('test-uuid'),
      new FakeDateHolder(date),
    );
  });

  describe('Create', () => {
    test('고객 생성', async () => {
      const customerDto: CustomerDto = Builder<CustomerDto>()
        .customerName('홍길동')
        .authProvider(AuthProvider.BASIC)
        .build();

      const customer = await service.create(customerDto);

      expect(customer).toBeDefined();
      expect(customer.customerId).toBe(1);
      expect(customer.uuid).toBe('test-uuid');
      expect(customer.customerAddress).not.toBe('서울시 강남구');
      expect(customer.customerAddress).toBeUndefined();
      expect(customer.customerName).toBe('홍길동');
    });
  });

  describe('Read', () => {
    test('고객 조회를 userId로 할 수 있다.', async () => {
      const customerDto: CustomerDto = Builder<CustomerDto>()
        .customerAddress('서울시 강남구')
        .customerName('홍길동')
        .authProvider(AuthProvider.BASIC)
        .build();

      const customer = await service.create(customerDto);
      const findCustomer = await service.findOne({ userId: 1 });

      expect(findCustomer).toBeDefined();
      expect(findCustomer.customerId).toBe(1);
      expect(findCustomer.uuid).toBe('test-uuid');
      expect(findCustomer.customerName).toBe('홍길동');
      expect(findCustomer).toStrictEqual(customer);
    });

    test('고객 조회를 uuid로 할 수 있다.', async () => {
      const customerDto: CustomerDto = Builder<CustomerDto>()
        .customerAddress('서울시 강남구')
        .customerName('홍길동')
        .authProvider(AuthProvider.BASIC)
        .build();

      const customer = await service.create(customerDto);
      const findCustomer = await service.findOne({ uuid: customer.uuid });

      expect(findCustomer).toBeDefined();
      expect(findCustomer.customerId).toBe(1);
      expect(findCustomer.uuid).toBe('test-uuid');
      expect(findCustomer.customerAddress).not.toBe('서울시 강남구');
      expect(findCustomer.customerName).toBe('홍길동');
      expect(findCustomer).toStrictEqual(customer);
    });

    test('고객 조회 시엔 개인정보가 있는경우 암호화되서 나온다.', async () => {
      const customerDto: CustomerDto = Builder<CustomerDto>()
        .customerName('홍길동')
        .authProvider(AuthProvider.BASIC)
        .build();

      const customer = await service.create(customerDto).then((customer) => {
        customer.customerAddress = '서울시 강남구';
        customer.customerDetailAddress = '역삼동';
        return service.update(customer);
      });
      const findCustomer = await service.findOne({ userId: 1 });

      expect(findCustomer).toBeDefined();
      expect(findCustomer.customerId).toBe(1);
      expect(findCustomer.uuid).toBe('test-uuid');
      expect(findCustomer.customerAddress).toBeDefined();
      expect(findCustomer.customerAddress).not.toBe('서울시 강남구');
      expect(findCustomer.customerDetailAddress).not.toBe('역삼동');
      expect(findCustomer.customerDetailAddress).toBeDefined();
      expect(findCustomer.customerName).toBe('홍길동');
      expect(findCustomer).toStrictEqual(customer);
    });

    test('고객 조회 시에 decrypt 옵션을 true로 한 경우 평문으로 나온다', async () => {
      const customerDto: CustomerDto = Builder<CustomerDto>()
        .customerName('홍길동')
        .authProvider(AuthProvider.BASIC)
        .build();

      const customer = await service.create(customerDto).then((customer) => {
        customer.customerAddress = '서울시 강남구';
        customer.customerDetailAddress = '역삼동';
        return service.update(customer);
      });
      const findCustomer = await service.findOne({ userId: 1 }, true);

      expect(findCustomer).toBeDefined();
      expect(findCustomer.customerId).toBe(1);
      expect(findCustomer.uuid).toBe('test-uuid');
      expect(findCustomer.customerAddress).toBeDefined();
      expect(findCustomer.customerAddress).toBe('서울시 강남구');
      expect(findCustomer.customerDetailAddress).toBe('역삼동');
      expect(findCustomer.customerDetailAddress).toBeDefined();
      expect(findCustomer.customerName).toBe('홍길동');
      expect(findCustomer).toStrictEqual(customer);
    });
  });

  describe('Update', () => {
    test('고객 정보 수정', async () => {
      const customerDto: CustomerDto = Builder<CustomerDto>()
        .customerAddress('서울시 강남구')
        .customerName('홍길동')
        .authProvider(AuthProvider.BASIC)
        .build();

      const customer = await service.create(customerDto);
      const updateCustomer = await service.update({
        userId: 1,
        customerName: '김철수',
      });

      expect(updateCustomer).toBeDefined();
      expect(updateCustomer.customerId).toBe(1);
      expect(updateCustomer.customerAddress).not.toBe('서울시 강남구');
      expect(updateCustomer.customerName).toBe('김철수');
      expect(updateCustomer).toStrictEqual(customer);
    });

    test('고객 정보 수정시 presignedUrlDto가 있으면 업데이트한다.', async () => {
      const customerDto: CustomerDto = Builder<CustomerDto>()
        .customerAddress('서울시 강남구')
        .customerName('홍길동')
        .authProvider(AuthProvider.BASIC)
        .build();

      const customer = await service.create(customerDto);
      const presignedUrlDto = Builder<PresignedUrlDto>()
        .fileName('test.jpg')
        .fileSize(1024)
        .build();

      const updateCustomer = await service.update({
        userId: 1,
        customerName: '김철수',
        presignedUrlDto: presignedUrlDto,
      });

      expect(updateCustomer).toBeDefined();
      expect(updateCustomer.customerId).toBe(1);
      expect(updateCustomer.customerAddress).not.toBe('서울시 강남구');
      expect(updateCustomer.customerName).toBe('김철수');
      expect(updateCustomer.presignedUrlDto).toBeDefined();
      expect(updateCustomer.presignedUrlDto?.url).toBeDefined();
      // User의 uuid를 사용하여 url을 생성하기 때문에 test-uuid가 나온다.
      expect(updateCustomer.presignedUrlDto?.url).toEqual('test-uuid');
      expect(updateCustomer.presignedUrlDto?.fileName).toBeDefined();
      expect(updateCustomer.presignedUrlDto?.fileName).toEqual('test.jpg');
      expect(updateCustomer.presignedUrlDto?.fileSize).toBeDefined();
      expect(updateCustomer.presignedUrlDto?.fileSize).toEqual(1024);
      expect(updateCustomer.presignedUrlDto?.expiredTime).toBeDefined();
      expect(updateCustomer.presignedUrlDto?.expiredTime).toEqual(60);
      expect(updateCustomer).toStrictEqual(customer);
    });
  });
});
