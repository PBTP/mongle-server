import { BusinessEntity } from "@schemas/business.entity";
import { AuthDto } from "@auth/presentation/auth.dto";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

export const BUSINESS_REPOSITORY = Symbol('BUSINESS_REPOSITORY');

export interface IBusinessRepository {
  getOne(dto: Partial<AuthDto>): Promise<BusinessEntity>;
  save(business: BusinessEntity): Promise<BusinessEntity>;
  create(dto: AuthDto): BusinessEntity;
}

@Injectable()
export class BusinessRepository implements IBusinessRepository {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
  ) {}

  async getOne(dto: Partial<AuthDto>): Promise<BusinessEntity> {
    return this.businessRepository.findOneOrFail({
      where: {
        businessId: dto.userId,
        uuid: dto.uuid,
      },
    });
  }
  async save(business: BusinessEntity): Promise<BusinessEntity> {
    return this.businessRepository.save(business);
  }
  create(dto: AuthDto): BusinessEntity {
    return this.businessRepository.create(dto);
  }
}
