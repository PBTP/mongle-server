import { ApiProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsBoolean, IsNumber } from 'class-validator';
import { CustomerTermEntity } from '../../schemas/customer-terms.entity';

export class CustomerTermDto {
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

  @ApiProperty({
    description: '고객 동의 약관 여부',
    required: true,
  })
  @IsBoolean()
  public hasAgreed: boolean;

  static from(customerTerm: CustomerTermEntity): CustomerTermDto {
    return Builder(CustomerTermDto)
      .termId(customerTerm.term.termId)
      .customerId(customerTerm.customer.customerId)
      .version(customerTerm.version)
      .hasAgreed(customerTerm.hasAgreed)
      .build();
  }
}
