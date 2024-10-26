import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../schemas/customer.entity';
import { CustomerDto } from '../presentation/customer.dto';
import { IUserService } from '../../auth/user.interface';
import { AuthDto } from '../../auth/presentation/auth.dto';
import { UserDto, UserType } from '../../auth/presentation/user.dto';
import { SecurityService } from '../../auth/application/security.service';
import { Image } from '../../schemas/image.entity';
import { ImageService } from '../../common/image/application/image.service';
import { toDto } from '../../common/function/util.function';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class CustomerService implements IUserService {
  readonly userType: UserType = 'customer';
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly securityService: SecurityService,
    private readonly imageService: ImageService,
  ) {}

  async create(dto: CustomerDto): Promise<Customer> {
    this.logger.log(`Create new customer id:${dto.customerId}`);
    return await this.customerRepository.save(
      this.customerRepository.create(dto),
    );
  }

  async findOne(
    dto: Partial<AuthDto>,
    encrypt: boolean = false,
  ): Promise<Customer> {
    if (dto.userId && dto.uuid) {
      throw new BadRequestException('식별할 수 없는 사용자입니다.');
    }

    const query = this.customerRepository
      .createQueryBuilder('C')
      .leftJoinAndMapOne('C.profileImage', Image, 'I', 'C.uuid =  I.uuid')
      .addSelect('I.image_url', 'profileImage');

    if (dto.userId) {
      query.andWhere('C.customer_id = :customer_id', {
        customer_id: dto.userId ?? dto.customerId,
      });
    }

    if (dto.uuid) {
      query.andWhere('C.uuid = :uuid', { uuid: dto.uuid });
    }

    query.orderBy('C.modified_at', 'DESC');
    query.addOrderBy('I.created_at', 'DESC');

    const customer = await query.getOne();

    if (!customer) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    if (encrypt && customer) {
      if (customer?.customerPhoneNumber) {
        customer.customerPhoneNumber = this.securityService.decrypt(
          customer?.customerPhoneNumber,
        );
      }

      if (customer?.customerAddress) {
        customer.customerAddress = this.securityService.decrypt(
          customer.customerAddress,
        );
      }

      if (customer?.customerDetailAddress) {
        customer.customerDetailAddress = this.securityService.decrypt(
          customer.customerDetailAddress,
        );
      }
    }

    return customer;
  }

  async update(dto: Partial<CustomerDto>): Promise<CustomerDto> {
    if (dto.phoneNumber || dto.customerPhoneNumber) {
      const phoneNumber = dto.phoneNumber ?? dto.customerPhoneNumber;

      dto.phoneNumber = this.securityService.encrypt(phoneNumber!);
    }

    if (dto.customerDetailAddress) {
      dto.customerDetailAddress = this.securityService.encrypt(
        dto.customerDetailAddress,
      );
    }

    if (dto.customerAddress) {
      dto.customerAddress = this.securityService.encrypt(dto.customerAddress);
    }

    return await this.findOne(dto)
      .then(async (customer) => {
        customer.customerName = dto.customerName ?? customer.customerName;
        customer.customerPhoneNumber =
          dto.phoneNumber ?? customer.customerPhoneNumber;
        customer.customerAddress =
          dto.customerAddress ?? customer.customerAddress;
        customer.customerDetailAddress =
          dto.customerDetailAddress ?? customer.customerDetailAddress;
        customer.refreshToken = dto.refreshToken ?? customer.refreshToken;

        return await this.customerRepository.save(customer);
      })
      .then(async (customer) => {
        if (customer && dto.presignedUrlDto) {
          const presignedUrlDto = await this.imageService.generatePreSignedUrls(
            customer.uuid,
            [dto.presignedUrlDto],
          );

          const customerDto = toDto(CustomerDto, customer);
          customerDto.presignedUrlDto = presignedUrlDto.find(() => true); // The first truthy vo (!undefined, !null ...)
          return customerDto;
        }
        return customer!;
      });
  }

  toUserDto(customer: Customer): UserDto {
    return {
      uuid: customer.uuid,
      name: customer.customerName,
      userId: customer.customerId,
      userType: this.userType,
      phoneNumber: customer.customerPhoneNumber,
      authProvider: customer.authProvider,
    };
  }
}
