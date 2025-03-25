import { ApiProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsDate, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { CustomerTermEntity } from '../../schemas/customer-terms.entity';
import { CustomerTerm } from '../customer-terms.domain';
import { Customer } from 'src/customer/customer.domain';
import { Term } from '../terms.domain';
import { DateHolder } from 'src/common/holder/date.holder';

type CustomerTermType = {
  get termId(): number;
  set termId(value: number);
  get customerId(): number;
  set customerId(value: number);
  get version(): number;
  set version(value: number);
  get agreedAt(): Date;
  set agreedAt(value: Date);
};

export class BaseCustomerTermDto implements CustomerTermType {
  @ApiProperty({ description: '약관 ID', required: true, readOnly: true })
  @IsNumber()
  private _termId: number;

  @ApiProperty({ description: '고객 ID', required: true, readOnly: true })
  @IsNumber()
  private _customerId: number;

  @ApiProperty({ description: '고객 동의 약관 버전', required: true })
  @IsNumber()
  private _version: number;

  @ApiProperty({ description: '동의 일시', required: true })
  @IsDate()
  private _agreedAt: Date;

  @Expose()
  get termId(): number {
    return this._termId;
  }

  set termId(value: number) {
    this._termId = value;
  }

  @Expose()
  get customerId(): number {
    return this._customerId;
  }

  set customerId(value: number) {
    this._customerId = value;
  }

  @Expose()
  get version(): number {
    return this._version;
  }

  set version(value: number) {
    this._version = value;
  }

  @Expose()
  get agreedAt(): Date {
    return this._agreedAt;
  }

  set agreedAt(agreedAt: Date) {
    this._agreedAt = agreedAt;
  }

  // Entity → DTO
  static fromEntity<T extends BaseCustomerTermDto>(customerTerm: CustomerTermEntity, dtoType: new () => T): T {
    const dto = Object.assign(new dtoType(), {
      term: customerTerm.term,
      customer: customerTerm.customer,
      version: customerTerm.version,
      agreedAt: customerTerm.agreedAt
    })
    return dto;
  }

  // DTO → Domain
  toModel(customer: Customer, term: Term, dateHolder: DateHolder): CustomerTerm {
    return Builder(CustomerTerm)
      .version(this.version)
      .agreedAt(this.agreedAt || dateHolder.now()) // 날짜 설정
      .customer(customer)
      .term(term)
      .build();
  }

  // Domain → DTO
  static from(domain: CustomerTerm): CustomerTermDto {
    return Builder(CustomerTermDto)
      .version(domain.version)
      .agreedAt(domain.agreedAt)
      .customerId(domain.customer.customerId ? domain.customer.customerId : 0)
      .termId(domain.term.termId)
      .build();
  }
}

export class CustomerTermDto extends BaseCustomerTermDto { }
