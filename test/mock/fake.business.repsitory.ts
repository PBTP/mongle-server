import { AuthDto } from 'src/auth/presentation/auth.dto';
import { IBusinessRepository } from '../../src/business/port/business.repository';
import { BusinessEntity } from '../../src/schemas/business.entity';

export class FakeBusinessRepository implements IBusinessRepository {
  private readonly businesses: BusinessEntity[] = [];

  getOne(dto: Partial<AuthDto>): Promise<BusinessEntity> {
    const findBusiness = this.businesses.find((business) => {
      return business.businessId === dto.userId || business.uuid === dto.uuid;
    });

    if (!findBusiness) {
      throw new Error('Business not found');
    }

    return Promise.resolve(findBusiness);
  }
  save(business: BusinessEntity): Promise<BusinessEntity> {
    let findBusiness = this.businesses.find(
      (b) => b.businessId === business.businessId || b.uuid === business.uuid,
    );
    if (!findBusiness) {
      this.businesses.push(business);
    }
    findBusiness = business;
    return Promise.resolve(findBusiness);
  }

  create(dto: AuthDto): BusinessEntity {
    return new BusinessEntity();
  }
}
