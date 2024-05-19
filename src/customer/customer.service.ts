import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerDto } from './dto/customer.dto';

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

  async findOne(dto: CustomerDto): Promise<Customer> {
    return await this.customerRepository.findOne({
      where: { ...dto },
    });
  }
}
