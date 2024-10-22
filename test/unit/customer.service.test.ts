import { FakeCustomerRepository } from '../mock/fake.customer.repository';
import { Builder } from 'builder-pattern';
import { AuthProvider } from '../../src/auth/presentation/user.dto';
import { CustomerService } from '../../src/customer/application/customer.service';
import { SecurityService } from '../../src/auth/application/security.service';
import { FakeConfigService } from '../mock/fake.config.service';
import { FakeCloudStorageService } from '../mock/fake.cloud-storage.service';
import { FakeImageRepository } from '../mock/fake.image.repository';
import { ImageService } from '../../src/common/image/application/image.service';
import { ConfigService } from '@nestjs/config';
import { Customer } from '../../src/customer/customer.domain';

describe('CustomerService', () => {
  let service: CustomerService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new FakeConfigService();

    configService.set('security/crypto/algorithm', 'aes-256-cbc');
    configService.set(
      'security/crypto/key',
      'mgmg_crypto_HSphC1OlzYwJmSS1Or1K',
    );

    service = new CustomerService(
      new FakeCustomerRepository(),
      new SecurityService(configService),
      new ImageService(
        new FakeCloudStorageService(),
        new FakeImageRepository(),
      ),
    );
  });

  test('서비스 생성 및 셋팅', () => {
    expect(service).toBeDefined();
    expect(configService.get('security/crypto/algorithm')).toBe('aes-256-cbc');
    expect(configService.get('security/crypto/key')).toBe(
      'mgmg_crypto_HSphC1OlzYwJmSS1Or1K',
    );
  });

  test('고객 생성', async () => {
    const customerDto: Customer = Builder<Customer>()
      .customerAddress('서울시 강남구')
      .customerName('홍길동')
      .authProvider(AuthProvider.BASIC)
      .build();

    const customer = await service.create(customerDto);
    expect(customer).toBeDefined();
    expect(customer.customerId).toBe(1);
    expect(customer.customerAddress).not.toBe('서울시 강남구');
    expect(customer.customerName).toBe('홍길동');
    expect(customer).toStrictEqual(customerDto);
  });

  test('고객 조회', async () => {
    const customerDto: Customer = Builder<Customer>()
      .customerAddress('서울시 강남구')
      .customerName('홍길동')
      .authProvider(AuthProvider.BASIC)
      .build();

    const customer = await service.create(customerDto);
    const findCustomer = await service.findOne({ userId: 1 });

    expect(findCustomer).toBeDefined();
    expect(findCustomer.customerId).toBe(1);
    expect(findCustomer.customerAddress).not.toBe('서울시 강남구');
    expect(findCustomer.customerName).toBe('홍길동');
    expect(findCustomer).toStrictEqual(customer);
  });

  test('고객 조회 시엔 개인정보가 있는경우 암호화되서 나온다.', async () => {
    const customerDto: Customer = Builder<Customer>()
      .customerAddress('서울시 강남구')
      .customerDetailAddress('역삼동')
      .customerName('홍길동')
      .authProvider(AuthProvider.BASIC)
      .build();

    const customer = await service.create(customerDto);
    const findCustomer = await service.findOne({ userId: 1 });

    expect(findCustomer).toBeDefined();
    expect(findCustomer.customerId).toBe(1);
    expect(findCustomer.customerAddress).toBeDefined();
    expect(findCustomer.customerAddress).not.toBe('서울시 강남구');
    expect(findCustomer.customerDetailAddress).not.toBe('역삼동');
    expect(findCustomer.customerDetailAddress).toBeDefined();
    expect(findCustomer.customerName).toBe('홍길동');
    expect(findCustomer).toStrictEqual(customer);
  });

  test('고객 조회 시에 decrypt 옵션을 true로 한 경우 평문으로 나온다', async () => {
    const customerDto: Customer = Builder<Customer>()
      .customerAddress('서울시 강남구')
      .customerDetailAddress('역삼동')
      .customerName('홍길동')
      .authProvider(AuthProvider.BASIC)
      .build();

    const customer = await service.create(customerDto);
    const findCustomer = await service.findOne({ userId: 1 }, true);

    expect(findCustomer).toBeDefined();
    expect(findCustomer.customerId).toBe(1);
    expect(findCustomer.customerAddress).toBeDefined();
    expect(findCustomer.customerAddress).toBe('서울시 강남구');
    expect(findCustomer.customerDetailAddress).toBe('역삼동');
    expect(findCustomer.customerDetailAddress).toBeDefined();
    expect(findCustomer.customerName).toBe('홍길동');
    expect(findCustomer).toStrictEqual(customer);
  });

  test('고객 정보 수정', async () => {
    const customerDto: Customer = Builder<Customer>()
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
});
