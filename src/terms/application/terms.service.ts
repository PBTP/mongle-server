import { Inject, Injectable } from '@nestjs/common';
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
import { BaseTermDto, TermDto } from '../presentation/terms.dto';
import { Term } from '../terms.domain';
import { CustomerTerm } from '../customer-terms.domain';
import { DATE_HOLDER, DateHolder, IDateHolder } from 'src/common/holder/date.holder';

@Injectable()
export class TermService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private customerRepository: ICustomerRepository,
    @Inject(TERM_REPOSITORY)
    private termRepository: ITermRepository,
    @Inject(TERM_REPOSITORY)
    private customerTermRepository: ICustomerTermRepository,
    @Inject(DATE_HOLDER)
    private readonly dateHolder: IDateHolder,
  ) { }

  async findById(termId: number): Promise<TermDto | null> {
    const termEntity = await this.termRepository.findOne(termId);
    return termEntity ? Term.from(termEntity).toDto() : null;
  }

  async findAll(): Promise<TermDto[]> {
    const terms: TermEntity[] = await this.termRepository.findAll();
    return terms.map((entity: TermEntity) => Term.from(entity).toDto());
  }

  async saveCustomerTerms(
    customerTerms: CustomerTermDto[],
    customer: ICustomer,
  ): Promise<CustomerTermDto[]> {
    const termDomains = await Promise.all(customerTerms.map(async (dto) => Term.from(await this.termRepository.getOne(dto.termId))));
    const customerTermsDomains = customerTerms.map((dto, i) => CustomerTerm.create(dto, customer, termDomains[i], this.dateHolder));
    const entities = await this.customerTermRepository.saveAll(customerTermsDomains.map((domain) => domain.toEntity()));
    return entities.map((entity: CustomerTermEntity) => CustomerTerm.from(entity).toDto());
  }

  async checkTerm(customer: ICustomer, termId: number): Promise<boolean> {
    // TODO: customerId?: number; 해결 필요
    const entity =
      await this.customerTermRepository.findByCustomerIdAndTermId(
        customer.customerId ? customer.customerId : 0,
        termId,
      );
    if (!entity) return false;
    const customerTerm = CustomerTerm.from(entity);
    return customerTerm.version === customerTerm.term.version;
  }

  async findPendingTerms(customer: ICustomer): Promise<TermDto[]> {
    // TODO: customerId?: number; 해결 필요
    const terms: TermEntity[] = await this.termRepository.findPendingTerms(
      customer.customerId ? customer.customerId : 0,
    );
    return terms.map((entity: TermEntity) => TermDto.from(entity, TermDto));
  }

  async findPendingMandatoryTerms(customer: ICustomer): Promise<TermDto[]> {
    // TODO: customerId?: number; 해결 필요
    const terms = await this.termRepository.findPendingMandatoryTerms(
      customer.customerId ? customer.customerId : 0,
    );
    return terms.map((entity: TermEntity) => Term.from(entity).toDto());
  }

  async deleteCustomerTerms(customer: ICustomer): Promise<void> {
    // TODO: customerId?: number; 해결 필요
    const terms = await this.customerTermRepository.deleteCustomerTerms(
      customer.customerId ? customer.customerId : 0,
    );
  }

  // async toCustomerTermEntity(
  //   // Customer, Term 엔티티 추출 후 Entity의 create 메소드 호출
  //   dto: CustomerTermDto,
  //   customer: ICustomer,
  // ): Promise<CustomerTermEntity> {
  //   const [customerDomain, term] = await Promise.all([
  //     this.customerRepository.getOne(customer),
  //     this.termRepository.getOne(dto.termId),
  //   ]);
  //   const customerEntity = CustomerEntity.from(customerDomain);

  //   // 중복 생성 방지 (CONSTRAINT unique_customer_term UNIQUE (customer_id, term_id))
  //   const existingTerm =
  //     await this.customerTermRepository.findByCustomerAndTerm(
  //       customerEntity,
  //       term,
  //     );

  //   return existingTerm
  //     ? existingTerm
  //     : CustomerTermEntity.create(dto, customerEntity, term);
  // }
}
