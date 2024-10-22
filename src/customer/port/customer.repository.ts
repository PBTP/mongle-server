import { CustomerEntity } from '../../schemas/customer.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthDto } from '../../auth/presentation/auth.dto';
import { ImageEntity } from '../../schemas/image.entity';
import { Customer } from '../customer.domain';

export const CUSTOMER_REPOSITORY = Symbol('ICustomerRepository');

export interface ICustomerRepository {
  create(customer: Customer): Customer;
  findOne(customer: Partial<AuthDto>): Promise<Customer>;
  save(customer: Customer): Promise<Customer>;
}

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly customerDB: Repository<CustomerEntity>) {}

  create(customer: Customer): Customer {
    return this.customerDB.create(customer).toModel();
  }

  async findOne(dto: Partial<AuthDto>): Promise<CustomerEntity> {
    const query = this.customerDB
      .createQueryBuilder('C')
      .leftJoinAndMapOne('C.profileImage', ImageEntity, 'I', 'C.uuid =  I.uuid')
      .addSelect('I.image_url', 'profileImage');

    if (dto.userId) {
      query.andWhere('C.customer_id = :customer_id', {
        customer_id: dto.userId,
      });
    }

    if (dto.uuid) {
      query.andWhere('C.uuid = :uuid', { uuid: dto.uuid });
    }

    query.orderBy('C.modified_at', 'DESC');
    query.addOrderBy('I.created_at', 'DESC');

    return await query.getOne();
  }

  async save(customer: CustomerEntity): Promise<CustomerEntity> {
    return await this.customerDB.save(customer);
  }
}
