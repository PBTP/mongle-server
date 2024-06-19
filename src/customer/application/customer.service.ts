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
    const existingCustomersCount = await this.customerRepository.count();
    const customerName = `사용자${existingCustomersCount + 1}`;

    const customer = this.customerRepository.create({
      uuid: dto.uuid,
      customerName: customerName,
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
    const where = [];

    for (const key in dto) {
      if (dto[key] !== undefined || dto[key] !== null) {
        where.push({ [key]: dto[key] });
      }
    }

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
