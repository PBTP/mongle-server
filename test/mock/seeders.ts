import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { CustomerEntity } from '../../src/schemas/customer.entity';
import { AuthProvider } from '../../src/auth/presentation/user.dto';
import { DateHolder } from '../../src/common/holder/date.holder';

export class CustomerSeeder implements Seeder {
  dateHolder: DateHolder;

  constructor(dateHolder: DateHolder) {
    this.dateHolder = dateHolder;
  }

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const customerRepository = dataSource.getRepository(CustomerEntity);

    const seedCustomer = customerRepository.create({
      appointments: [],
      authProvider: AuthProvider.KAKAO,
      chatRooms: [],
      favorites: [],
      pets: [],
      reviews: [],
      uuid: 'customer-seed-uuid',
      customerId: 1,
      customerName: 'customer-seed-name',
      customerAddress: 'customer-seed-address',
      customerPhoneNumber: 'customer-seed-phone',
      customerDetailAddress: 'customer-seed-detail-address',
      createdAt: this.dateHolder.now(),
      modifiedAt: this.dateHolder.now(),
    });

    const customer = await customerRepository.save(seedCustomer);
  }
}
