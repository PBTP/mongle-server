import { ApiProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { CustomerTermEntity } from '../../schemas/customer-terms.entity';

type CustomerTermType = {
  get termId(): number;
  set termId(value: number);
  get customerId(): number;
  set customerId(value: number);
  get version(): number;
  set version(value: number);
};

export class CustomerTermDto implements CustomerTermType {
  @ApiProperty({ description: '약관 ID', required: true, readOnly: true })
  @IsNumber()
  @Expose()
  private _termId: number;

  @ApiProperty({ description: '고객 ID', required: true, readOnly: true })
  @IsNumber()
  @Expose()
  private _customerId: number;

  @ApiProperty({ description: '고객 동의 약관 버전', required: true })
  @IsNumber()
  @Expose()
  private _version: number;

  constructor(termId: number, customerId: number, version: number) {
    this._termId = termId;
    this._customerId = customerId;
    this._version = version;
  }

  get termId(): number {
    return this._termId;
  }

  set termId(value: number) {
    this._termId = value;
  }

  get customerId(): number {
    return this._customerId;
  }

  set customerId(value: number) {
    this._customerId = value;
  }

  get version(): number {
    return this._version;
  }

  set version(value: number) {
    this._version = value;
  }

  static from(customerTerm: CustomerTermEntity): CustomerTermDto {
    return new CustomerTermDto(
      customerTerm.term.termId,
      customerTerm.customer.customerId,
      customerTerm.version
    );
  }
}
