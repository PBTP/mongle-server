import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from '../../auth/user.interface';
import { UserDto, UserType } from '../../auth/presentation/user.dto';
import { Business } from '../../schemas/business.entity';
import { AuthDto } from '../../auth/presentation/auth.dto';
import { Builder } from 'builder-pattern';

@Injectable()
export class BusinessService implements IUserService {
  readonly userType: UserType = 'business';
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async findOne(dto: Partial<AuthDto>): Promise<Business> {
    return await this.businessRepository.findOneOrFail({
      where: {
        businessId: dto.userId,
        uuid: dto.uuid,
      },
    });
  }

  async create(dto: UserDto): Promise<Business> {
    const business = new Business();
    Builder<Business>()
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

  async update(dto: AuthDto): Promise<Business> {
    return this.findOne(dto).then(async (business) => {
      business.businessName = dto.name ?? business.businessName;
      business.businessPhoneNumber =
        dto.phoneNumber ?? business.businessPhoneNumber;
      business.refreshToken = dto.refreshToken ?? business.refreshToken;

      return await this.businessRepository.save(business);
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
