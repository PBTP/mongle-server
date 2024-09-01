import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../schemas/customers.entity';
import { CustomerDto } from '../presentation/customer.dto';
import { IUserService } from '../../auth/user.interface';
import { AuthDto } from '../../auth/presentation/auth.dto';
import { UserDto, UserType } from '../../auth/presentation/user.dto';

@Injectable()
export class CustomerService implements IUserService {
  readonly userType: UserType = 'customer';

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CustomerDto): Promise<Customer> {
    return await this.customerRepository.save(
      this.customerRepository.create(dto),
    );
  }

  async findOne(dto: Partial<AuthDto>): Promise<Customer> {
    const where = {};

    dto.userId && (where['customerId'] = dto.userId);
    dto.uuid && (where['uuid'] = dto.uuid);

    return await this.customerRepository.findOne({
      where: where,
    });
  }

  async update(dto: Partial<CustomerDto>): Promise<Customer> {
    return this.findOne(dto).then(async (customer) => {
      if (customer) {
        customer.customerLocation =
          dto.customerLocation ?? customer.customerLocation;
        customer.customerName = dto.customerName ?? customer.customerName;
        customer.customerPhoneNumber =
          dto.customerPhoneNumber ?? customer.customerPhoneNumber;
        customer.refreshToken = dto.refreshToken ?? customer.refreshToken;

        return await this.customerRepository.save(customer);
      }
    });
  }

  toUserDto(customer: Customer): UserDto {
    return {
      uuid: customer.uuid,
      name: customer.customerName,
      userId: customer.customerId,
      userType: this.userType,
      phoneNumber: customer.customerPhoneNumber,
      authProvider: customer.authProvider,
    };
  }
}
