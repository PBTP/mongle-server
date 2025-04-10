import { Inject, Injectable } from '@nestjs/common';
import { ICustomer } from '../../customer/customer.domain';
import { CUSTOMER_TERM_REPOSITORY, ICustomerTermRepository } from '../port/customer-terms.repository';
import { ITermRepository, TERM_REPOSITORY } from '../port/terms.repository';
import { CustomerTermDto } from '../presentation/customer-terms.dto';
import { Term } from '../terms.domain';
import { CustomerTerm } from '../customer-terms.domain';
import { DATE_HOLDER, IDateHolder } from "../../common/holder/date.holder";

@Injectable()
export class TermService {
  constructor(
    @Inject(TERM_REPOSITORY)
    private termRepository: ITermRepository,
    @Inject(CUSTOMER_TERM_REPOSITORY)
    private customerTermRepository: ICustomerTermRepository,
    @Inject(DATE_HOLDER)
    private readonly dateHolder: IDateHolder,
  ) { }

  async findById(termId: number): Promise<Term | null> {
    return this.termRepository.findOne(termId);
  }

  async findAll(): Promise<Term[]> {
    const terms: Term[] = await this.termRepository.findAll();
    return terms;
  }

  async saveCustomerTerms(
    customerTerms: CustomerTermDto[],
    customer: ICustomer,
  ): Promise<CustomerTerm[]> {
    const termDomains = await Promise.all(
      customerTerms.map(async (dto) => await this.termRepository.getOne(dto.termId)),
    );
    const customerTermsDomains = customerTerms.map((dto, i) =>
      dto.toModel(customer, termDomains[i], this.dateHolder),
    );
    await this.customerTermRepository.saveAll(customerTermsDomains);
    return customerTermsDomains;
  }

  async saveCustomerTerm(
    dto: CustomerTermDto,
    customer: ICustomer,
  ): Promise<CustomerTerm> {
    const term = await this.termRepository.getOne(dto.termId);
    const domain = dto.toModel(customer, term, this.dateHolder);
    await this.customerTermRepository.save(domain);
    return domain;
  }

  async checkTerm(customer: ICustomer, termId: number): Promise<boolean> {
    // TODO: customerId?: number; 해결 필요
    const customerTerm =
      await this.customerTermRepository.findByCustomerIdAndTermId(
        customer.customerId ?? 0,
        termId,
      );
    if (!customerTerm) return false;
    return customerTerm.version === customerTerm.term.version;
  }

  async findAgreedTerms(customer: ICustomer): Promise<CustomerTerm[]> {
    // TODO: customerId?: number; 해결 필요
    const customerTerms: CustomerTerm[] = await this.customerTermRepository.findByCustomer(
      customer.customerId ?? 0,
    );
    return customerTerms;
  }

  async findPendingTerms(customer: ICustomer): Promise<Term[]> {
    // TODO: customerId?: number; 해결 필요
    return this.termRepository.findPendingTerms(
      customer.customerId ?? 0,
    );
  }

  async findPendingMandatoryTerms(customer: ICustomer): Promise<Term[]> {
    // TODO: customerId?: number; 해결 필요
    const allPendingTerms = await this.termRepository.findPendingTerms(
      customer.customerId ?? 0,
    );
    return allPendingTerms
      .filter((term) => term.isMandatory);
  }

  async findPendingOptionalTerms(customer: ICustomer): Promise<Term[]> {
    // TODO: customerId?: number; 해결 필요
    const allPendingTerms = await this.termRepository.findPendingTerms(
      customer.customerId ?? 0,
    );
    return allPendingTerms
      .filter((term) => !term.isMandatory);
  }

  async deleteCustomerTerms(customer: ICustomer): Promise<void> {
    // TODO: customerId?: number; 해결 필요
    await this.customerTermRepository.deleteCustomerTerms(
      customer.customerId ?? 0,
    );
  }
}
