import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Builder } from 'builder-pattern';
import { UserDto } from '../../auth/presentation/user.dto';
import { CustomerEntity } from '../../schemas/customer.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async randomUserUuid(): Promise<UserDto> {
    // Get random user
    const randomId = await this.customerRepository.count().then((count) => {
      return Math.floor(Math.random() * count);
    });

    return this.customerRepository
      .findOne({
        where: { customerId: randomId },
      })
      .then((customer) => {
        return Builder<UserDto>()
          .userId(customer.customerId)
          .userType('customer')
          .uuid(customer.uuid)
          .name(customer.customerName)
          .authProvider(customer.authProvider)
          .build();
      });
  }
}
