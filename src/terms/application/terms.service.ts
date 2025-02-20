import { Inject, Injectable } from '@nestjs/common';
import { DATE_HOLDER, DateHolder } from '../../common/holder/date.holder';
import { UUID_HOLDER, UUIDHolder } from '../../common/holder/uuid.holders';
import { ICustomer } from '../../customer/customer.domain';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../../customer/port/customer.repository';
import { CustomerTermEntity } from '../../schemas/customer-terms.entity';
import { CustomerEntity } from '../../schemas/customer.entity';
import { TermEntity } from '../../schemas/terms.entity';
import { ICustomerTermRepository } from '../port/customer-terms.repository';
import { ITermRepository, TERM_REPOSITORY } from '../port/terms.repository';
import { CustomerTermDto } from '../presentation/customer-terms.dto';
import { TermDto } from '../presentation/terms.dto';

@Injectable()
export class TermService {
  constructor(
    @Inject(UUID_HOLDER)
    private uuidHolder: UUIDHolder,
    @Inject(DATE_HOLDER)
    private dateHolder: DateHolder,
    @Inject(CUSTOMER_REPOSITORY)
    private customerRepository: ICustomerRepository,
    @Inject(TERM_REPOSITORY)
    private termRepository: ITermRepository,
    @Inject(TERM_REPOSITORY)
    private customerTermRepository: ICustomerTermRepository,
  ) {}

  async findOne(termId: number): Promise<TermEntity | null> {
    return await this.termRepository.findOne(termId);
  }

  async findAll(): Promise<TermEntity[]> {
    return await this.termRepository.findAll();
  }

  async saveCustomerTerms(
    customerTerms: CustomerTermDto[],
    customer: ICustomer,
  ): Promise<CustomerTermDto[]> {
    const entitiesBefore = await Promise.all(
      customerTerms.map((dto) => this.toCustomerTermEntity(dto, customer)),
    );
    const entities = await this.customerTermRepository.saveAll(entitiesBefore);
    return entities.map((entity: CustomerTermEntity) =>
      CustomerTermDto.from(entity),
    );
  }

  findPendingTerms(customer: ICustomer): Promise<TermDto[]> {
    // todo: customerId?: number; 해결 필요
    return this.termRepository.findPendingTerms(
      customer.customerId ? customer.customerId : 0,
    );
  }

  async toCustomerTermEntity(
    // Customer, Term 엔티티 추출 후 Entity의 create 메소드 호출
    dto: CustomerTermDto,
    customer: ICustomer,
  ): Promise<CustomerTermEntity> {
    const [customerDomain, term] = await Promise.all([
      this.customerRepository.getOne(customer),
      this.termRepository.getOne(dto.termId),
    ]);
    const customerEntity = CustomerEntity.from(
      customerDomain,
      this.uuidHolder,
      this.dateHolder,
    );

    // 중복 생성 방지 (CONSTRAINT unique_customer_term UNIQUE (customer_id, term_id))
    const existingTerm =
      await this.customerTermRepository.findByCustomerAndTerm(
        customerEntity,
        term,
      );

    return existingTerm
      ? existingTerm
      : CustomerTermEntity.create(dto, customerEntity, term);
  }
}
