import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserService } from '../../auth/user.interface';
import { UserDto, UserType } from '../../auth/presentation/user.dto';
import { BusinessEntity } from '../../schemas/business.entity';
import { AuthDto } from '../../auth/presentation/auth.dto';
import { Builder } from 'builder-pattern';
import {
  BUSINESS_REPOSITORY,
  IBusinessRepository,
} from '../port/business.repository';

@Injectable()
export class BusinessService implements IUserService {
  readonly userType: UserType = 'business';
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
  ) {}

  async getOne(dto: Partial<AuthDto>): Promise<BusinessEntity> {
    return await this.businessRepository.getOne(dto);
  }

  async findOne(dto: Partial<AuthDto>): Promise<BusinessEntity | null> {
    return await this.businessRepository.getOne(dto);
  }

  async create(dto: UserDto): Promise<BusinessEntity> {
    const business = new BusinessEntity();
    Builder<BusinessEntity>()
      .uuid(dto.uuid!)
      .businessName(dto.name!)
      .authProvider(dto.authProvider!)
      .build();

    return await this.businessRepository
      .save(this.businessRepository.create(business))
      .then((newBusiness) => {
        this.logger.log(
          `Create new business id:${newBusiness.businessId}, name:${newBusiness.businessName}`,
        );
        return newBusiness;
      });
  }

  async update(dto: AuthDto): Promise<BusinessEntity> {
    return this.getOne(dto).then(async (business) => {
      business.businessName = dto.name ?? business.businessName;
      business.businessPhoneNumber =
        dto.phoneNumber ?? business.businessPhoneNumber;
      business.refreshToken = dto.refreshToken ?? business.refreshToken;

      return await this.businessRepository.save(business);
    });
  }

  toUserDto(business: BusinessEntity): UserDto {
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
