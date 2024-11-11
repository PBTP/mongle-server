import { Builder } from 'builder-pattern';
import { CustomerDto } from '../../../src/customer/presentation/customer.dto';
import { AuthProvider } from '../../../src/auth/presentation/user.dto';
import { FakeDateHolder, FakeUuidHolder } from '../../mock/fake.holder';
import { Customer } from '../../../src/customer/customer.domain';
import { IUUIDHolder } from '../../../src/common/holder/uuid.holders';
import { IDateHolder } from '../../../src/common/holder/date.holder';

describe('Customer', () => {
  let uuidHolder: IUUIDHolder;
  let dateHolder: IDateHolder;
  const date = new Date();

  beforeEach(() => {
    uuidHolder = new FakeUuidHolder('test-uuid');
    dateHolder = new FakeDateHolder(date);
  });

  describe('from', () => {
    it('CustomerDto로부터 Customer 객체를 생성한다', () => {
      const customerDto: CustomerDto = Builder<CustomerDto>()
        .customerName('홍길동')
        .customerPhoneNumber('010-1234-5678')
        .customerAddress('서울시 강남구')
        .customerDetailAddress('역삼동')
        .authProvider(AuthProvider.BASIC)
        .build();
      const customer = Customer.from(customerDto, uuidHolder, dateHolder);

      expect(customer).toBeDefined();
      expect(customer.uuid).toBe(uuidHolder.generatedUuid());
      expect(customer.customerName).toBe('홍길동');
      expect(customer.authProvider).toBe(AuthProvider.BASIC);
      expect(customer.createdAt).toBe(dateHolder.now());
      expect(customer.modifiedAt).toBe(dateHolder.now());
    });

    it('CustomerDto에 필수 필드가 없으면 에러를 던진다', () => {
      const customerDto: CustomerDto = Builder<CustomerDto>()
        .customerPhoneNumber('010-1234-5678')
        .customerAddress('서울시 강남구')
        .customerDetailAddress('역삼동')
        .authProvider(AuthProvider.BASIC)
        .build();

      expect(() =>
        Customer.from(customerDto, uuidHolder, dateHolder),
      ).toThrow();
    });
  });

  describe('update', () => {
    it('CustomerDto로부터 Customer 객체를 업데이트한다', () => {
      const customerDto: CustomerDto = Builder<CustomerDto>()
        .customerName('홍길동')
        .customerPhoneNumber('010-1234-5678')
        .customerAddress('서울시 강남구')
        .customerDetailAddress('역삼동')
        .authProvider(AuthProvider.BASIC)
        .build();

      const customer = Customer.update(customerDto, dateHolder);

      expect(customer).toBeDefined();
      expect(customer.customerName).toBe('홍길동');
      expect(customer.customerPhoneNumber).toBe('010-1234-5678');
      expect(customer.customerAddress).toBe('서울시 강남구');
      expect(customer.customerDetailAddress).toBe('역삼동');
      expect(customer.modifiedAt).toBe(dateHolder.now());
    });
  });
});
