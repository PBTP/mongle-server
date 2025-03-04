import { ApiProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsNumber } from 'class-validator';
import { CustomerTermEntity } from '../../schemas/customer-terms.entity';

type CustomerTermType = {
  termId: number;
  customerId: number;
  version: number;
}

export class CustomerTermDto implements CustomerTermType {
  @ApiProperty({
    description: '약관 ID',
    required: true,
    readOnly: true,
  })
  @IsNumber()
  public termId: number;

  @ApiProperty({
    description: '고객 ID',
    required: true,
    readOnly: true,
  })
  @IsNumber()
  public customerId: number;

  @ApiProperty({
    description: '고객 동의 약관 버전',
    required: true,
  })
  @IsNumber()
  public version: number;

  static from(customerTerm: CustomerTermEntity): CustomerTermDto {
    return Builder(CustomerTermDto)
      .termId(customerTerm.term.termId)
      .customerId(customerTerm.customer.customerId)
      .version(customerTerm.version)
      .build();
  }
}
