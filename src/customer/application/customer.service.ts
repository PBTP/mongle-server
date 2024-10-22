import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomerEntity } from '../../schemas/customer.entity';
import { CustomerDto } from '../presentation/customer.dto';
import { IUserService } from '../../auth/user.interface';
import { AuthDto } from '../../auth/presentation/auth.dto';
import { UserDto, UserType } from '../../auth/presentation/user.dto';
import { SecurityService } from '../../auth/application/security.service';
import { ImageService } from '../../common/image/application/image.service';
import { toDto } from '../../common/function/util.function';
import { CUSTOMER_REPOSITORY, ICustomerRepository } from '../port/customer.repository';

@Injectable()
export class CustomerService implements IUserService {
  readonly userType: UserType = 'customer';
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    private readonly securityService: SecurityService,
    private readonly imageService: ImageService,
  ) {}

  async create(dto: CustomerDto): Promise<CustomerEntity> {

    this.personalInfoEncrypt(dto);

    return await this.customerRepository.save(
      this.customerRepository.create(dto),
    );
  }

  async findOne(
    dto: Partial<AuthDto>,
    decrypt: boolean = false,
  ): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne(dto);

    if (decrypt) {
      customer.customerPhoneNumber = this.securityService.decrypt(
        customer.customerPhoneNumber,
      );

      customer.customerAddress = this.securityService.decrypt(
        customer.customerAddress,
      );

      customer.customerDetailAddress = this.securityService.decrypt(
        customer.customerDetailAddress,
      );
    }

    return customer;
  }

  async update(dto: Partial<CustomerDto>): Promise<CustomerDto> {
    this.personalInfoEncrypt(dto);

    return await this.findOne(dto)
      .then(async (customer) => {
        if (customer) {
          customer.customerName = dto.customerName ?? customer.customerName;
          customer.customerPhoneNumber =
            dto.phoneNumber ?? customer.customerPhoneNumber;
          customer.customerAddress =
            dto.customerAddress ?? customer.customerAddress;
          customer.customerDetailAddress =
            dto.customerDetailAddress ?? customer.customerDetailAddress;
          customer.refreshToken = dto.refreshToken ?? customer.refreshToken;

          return await this.customerRepository.save(customer);
        }
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
        return customer;
      });
  }

  private personalInfoEncrypt(dto: Partial<CustomerDto>) {
    if (dto.phoneNumber || dto.customerPhoneNumber) {
      dto.phoneNumber = this.securityService.encrypt(
        dto.phoneNumber ?? dto.customerPhoneNumber
      );
    }

    if (dto.customerDetailAddress) {
      dto.customerDetailAddress = this.securityService.encrypt(
        dto.customerDetailAddress
      );
    }

    if (dto.customerAddress) {
      dto.customerAddress = this.securityService.encrypt(dto.customerAddress);
    }
  }

  toUserDto(customer: CustomerEntity): UserDto {
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
