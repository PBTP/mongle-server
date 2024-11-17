import { CustomerController } from '../../../../src/customer/presentation/customer.controller';
import { CustomerService } from '../../../../src/customer/application/customer.service';
import { FakeCustomerRepository } from '../../../mock/fake.customer.repository';
import { FakeSecurityService } from '../../../mock/fake.security.service';
import { ImageService } from '../../../../src/common/image/application/image.service';
import { FakeCloudStorageService } from '../../../mock/fake.cloud-storage.service';
import { FakeImageRepository } from '../../../mock/fake.image.repository';
import { FakeDateHolder, FakeUuidHolder } from '../../../mock/fake.holder';
import { Builder } from 'builder-pattern';
import { CustomerDto } from '../../../../src/customer/presentation/customer.dto';
import { AuthProvider } from '../../../../src/auth/presentation/user.dto';


describe('CustomerController', () => {
  let customerController: CustomerController;
  const date = new Date();

  beforeEach(async () => {
    const customerService = new CustomerService(
      new FakeCustomerRepository(),
      new FakeSecurityService(),
      new ImageService(
        new FakeCloudStorageService(),
        new FakeImageRepository(),
      ),
      new FakeUuidHolder(),
      new FakeDateHolder(date),
    );
    customerController = new CustomerController(customerService);

    const initCustomer = Builder(CustomerDto)
      .customerName('홍길동')
      .authProvider(AuthProvider.BASIC)
      .build();

    await customerService.create(initCustomer).then(async (v) => {
      // create는 customerName, authProvider 필수 필드만갖고 생성하기 때문에 update를 통해 나머지 필드 적용
      await customerService.update({
        userId: v.customerId,
        customerAddress: '서울시 강남구',
        customerDetailAddress: '역삼동',
        customerPhoneNumber: '010-1234-5678',
      });
    });
  });

  describe('READ', () => {
    test('내 정보 조회', async () => {
      // const customer = Builder(Customer).customerId(1).build();
      // const responseEntity = await customerController.getMyCustomer(customer);
      // const getCustomer = responseEntity.data;
      //
      // // ResponseEntity 검증
      // expect(responseEntity).toBeDefined();
      // expect(responseEntity.statusCode).toBe(200);
      // expect(responseEntity.data).toBeDefined();
      //
      // expect(getCustomer).toBeDefined();
      // expect(getCustomer?.userId).toBe(1);
      // expect(getCustomer?.customerId).toBe(1);
      // expect(getCustomer?.name).toBe('홍길동');
      // expect(getCustomer?.customerName).toBe('홍길동');
      // expect(getCustomer?.customerPhoneNumber).toBe('decrypted');
      // expect(getCustomer?.customerAddress).toBe('decrypted');
      // expect(getCustomer?.customerDetailAddress).toBe('decrypted');
      // expect(getCustomer?.authProvider).toBe(AuthProvider.BASIC);
    });
  });

  describe('UPDATE', () => {
    test('내 정보 수정', async () => {
      // const customer = Builder(Customer).customerId(1).build();
      // const updateCustomer = Builder(CustomerDto)
      //   .customerName('김철수')
      //   .customerPhoneNumber('010-5678-1234')
      //   .customerAddress('서울시 강북구')
      //   .customerDetailAddress('미아동')
      //   .build();
      //
      // const responseEntity = await customerController.updateProfile(
      //   customer,
      //   updateCustomer,
      // );
      //
      // const getCustomer = responseEntity.data;
      //
      // // ResponseEntity 검증
      // expect(responseEntity).toBeDefined();
      // expect(responseEntity.statusCode).toBe(200);
      // expect(responseEntity.data).toBeDefined();
      //
      // expect(getCustomer).toBeDefined();
      // expect(getCustomer?.userId).toBe(1);
      // expect(getCustomer?.customerId).toBe(1);
      // expect(getCustomer?.name).toBe('김철수');
      // expect(getCustomer?.customerName).toBe('김철수');
      // expect(getCustomer?.customerPhoneNumber).toBe('encrypted');
      // expect(getCustomer?.customerAddress).toBe('encrypted');
      // expect(getCustomer?.customerDetailAddress).toBe('encrypted');
      // expect(getCustomer?.authProvider).toBe(AuthProvider.BASIC);
    });
  });
});
