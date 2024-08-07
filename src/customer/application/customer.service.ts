import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../schemas/customers.entity';
import { CustomerDto } from '../presentation/customer.dto';
import { CreateCustomerDto } from 'src/auth/presentation/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  // TODO(Seokmin): Remove this method after implementing the registration process
  async createOld(dto: CustomerDto): Promise<Customer> {
    const newCustomer = await this.customerRepository.create(dto);
    return await this.customerRepository.save(newCustomer);
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create({
      uuid: dto.uuid,
      customerName: dto.name,
      customerPhoneNumber: dto.phoneNumber,
      customerLocation: null,
      authProvider: dto.authProvider,
      createdAt: new Date(),
      modifiedAt: new Date(),
      refreshToken: null,
    });

    return await this.customerRepository.save(customer);
  }

  async findOne(dto: Partial<Customer>): Promise<Customer> {
    const where = {};

    dto.customerId && (where['customerId'] = dto.customerId);
    dto.uuid && (where['uuid'] = dto.uuid);

    return await this.customerRepository.findOne({
      where: where,
    });
  }

  async update(dto: CustomerDto): Promise<Customer> {
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
