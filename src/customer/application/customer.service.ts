import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../schemas/customers.entity';
import { CustomerDto } from '../presentation/customer.dto';
import { IUserService } from '../../auth/user.interface';
import { AuthDto } from '../../auth/presentation/auth.dto';

@Injectable()
export class CustomerService implements IUserService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CustomerDto): Promise<Customer> {
    const newCustomer = await this.customerRepository.create(dto);
    return await this.customerRepository.save(newCustomer);
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
}
