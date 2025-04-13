import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomerDto } from '../presentation/customer.dto';
import { IUserService } from "@auth/user.interface";
import { AuthDto } from "@auth/presentation/auth.dto";
import { UserDto, UserType } from "@auth/presentation/user.dto";
import {
  ISecurityService,
  SECURITY_SERVICE,
} from "@auth/application/security.service";
import { ImageService } from "@common/image/application/image.service";
import { BadRequestException } from '@nestjs/common/exceptions';
import { Customer, ICustomer } from '../customer.domain';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../port/customer.repository';
import { IUUIDHolder, UUID_HOLDER } from "@common/holder/uuid.holders";
import { DATE_HOLDER, IDateHolder } from "@common/holder/date.holder";

@Injectable()
export class CustomerService implements IUserService {
  readonly userType: UserType = 'customer';
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(SECURITY_SERVICE)
    private readonly securityService: ISecurityService,
    private readonly imageService: ImageService,
    @Inject(UUID_HOLDER)
    private readonly uuidHolder: IUUIDHolder,
    @Inject(DATE_HOLDER)
    private readonly dateHolder: IDateHolder,
  ) {}

  async create(dto: CustomerDto): Promise<ICustomer> {
    if (dto.phoneNumber) {
      dto.phoneNumber = this.securityService.encrypt(dto.phoneNumber);
    }

    if (dto.customerDetailAddress) {
      dto.customerDetailAddress = this.securityService.encrypt(
        dto.customerDetailAddress,
      );
    }

    if (dto.customerAddress) {
      dto.customerAddress = this.securityService.encrypt(dto.customerAddress);
    }

    return await this.customerRepository.save(
      this.customerRepository.create(
        Customer.from(dto, this.uuidHolder, this.dateHolder),
      ),
    );
  }

  findOne(dto: Partial<AuthDto>): Promise<UserDto | null> {
    return this.customerRepository.findOne(dto);
  }

  async getOne(
    dto: Partial<AuthDto>,
    decrypt: boolean = false,
  ): Promise<Customer> {
    if (!dto.userId && !dto.uuid && !dto.customerId && !dto.refreshToken) {
      throw new BadRequestException('식별할 수 없는 사용자입니다.');
    }

    const customer = await this.customerRepository.getOne(dto);

    if (decrypt && customer) {
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

  async update(dto: Partial<CustomerDto>): Promise<Customer> {
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

    return await this.getOne(dto)
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
            customer.uuid!,
            [dto.presignedUrlDto],
          );

          customer.presignedUrlDto = presignedUrlDto.find(() => true); // The first truthy vo (!undefined, !null ...)
          return customer;
        }
        return customer!;
      });
  }

  toUserDto(customer: ICustomer): UserDto {
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
