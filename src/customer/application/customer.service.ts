import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CustomerDto } from '../presentation/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CustomerDto): Promise<Customer> {
    const newCustomer = await this.customerRepository.create(dto);
    return await this.customerRepository.save(newCustomer);
  }

  async findOne(dto: Partial<CustomerDto>): Promise<Customer> {
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
