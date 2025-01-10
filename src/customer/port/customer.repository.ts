import { CustomerEntity } from '../../schemas/customer.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthDto } from '../../auth/presentation/auth.dto';
import { ImageEntity } from '../../schemas/image.entity';
import { Customer } from '../customer.domain';
import { InjectRepository } from '@nestjs/typeorm';

export const CUSTOMER_REPOSITORY = Symbol('ICustomerRepository');

export interface ICustomerRepository {
  create(customer: Customer): Customer;
  getOne(customer: Partial<Customer>): Promise<Customer>;
  findOne(customer: Partial<Customer>): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
}

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerDB: Repository<CustomerEntity>,
  ) {}

  create(customer: Customer): Customer {
    return CustomerEntity.toModel(this.customerDB.create(customer));
  }

  async getOne(dto: Partial<AuthDto>): Promise<Customer> {
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

    const customerEntity: CustomerEntity = await query.getOneOrFail();
    return CustomerEntity.toModel(customerEntity);
  }

  async findOne(dto: Partial<AuthDto>): Promise<Customer | null> {
    const query = this.customerDB
      .createQueryBuilder('C')
      .leftJoinAndMapOne('C.profileImage', ImageEntity, 'I', 'C.uuid =  I.uuid')
      .addSelect('I.image_url', 'profileImage');

    if (!dto.userId && !dto.uuid) {
      // 식별할 수 있는 값이 없는 경우 가장 첫번째 record가 반환될 수 있기 때문에 검증 후 null return
      return null;
    }

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

    const customerEntity: CustomerEntity | null = await query.getOne();
    if (!customerEntity) {
      return null;
    }
    return CustomerEntity.toModel(customerEntity);
  }

  async save(customer: Customer): Promise<Customer> {
    const customerEntity: CustomerEntity = await this.customerDB.save(customer);
    return CustomerEntity.toModel(customerEntity);
  }
}
