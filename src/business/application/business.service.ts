import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from '../../auth/user.interface';
import { UserDto, UserType } from '../../auth/presentation/user.dto';
import { Business } from '../../schemas/business.entity';
import { TAuthDto } from '../../auth/presentation/auth.dto';

@Injectable()
export class BusinessService implements IUserService {
  readonly userType: UserType = 'business';
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async findOne(dto: Partial<TAuthDto>): Promise<Business> {
    const where = {};

    dto.userId && (where['businessId'] = dto.userId ?? dto['businessId']);
    dto.uuid && (where['uuid'] = dto.uuid);

    return await this.businessRepository.findOne({
      where: where,
    });
  }

  async create(dto: UserDto): Promise<Business> {
    const business = new Business();
    business.uuid = dto.uuid;
    business.businessName = dto.name;
    business.authProvider = dto.authProvider;

    return await this.businessRepository
      .save(this.businessRepository.create(business))
      .then((newBusiness) => {
        this.logger.log(
          `Create new business id:${newBusiness.businessId}, name:${newBusiness.businessName}`,
        );
        return newBusiness;
      });
  }

  async update(dto: TAuthDto): Promise<Business> {
    return this.findOne(dto).then(async (business) => {
      if (business) {
        business.businessName = dto.name;
        business.businessPhoneNumber = dto.phoneNumber;
        business.refreshToken = dto.refreshToken ?? business.refreshToken;

        return await this.businessRepository.save(business);
      }
    });
  }

  toUserDto(business: Business): UserDto {
    return {
      uuid: business.uuid,
      name: business.businessName,
      userId: business.businessId,
      userType: this.userType,
      phoneNumber: business.businessPhoneNumber,
      authProvider: business.authProvider,
    };
  }
}
