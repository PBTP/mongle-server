import { Injectable } from '@nestjs/common';
import { IUserService } from '../user.interface';
import { CustomerService } from '../../customer/application/customer.service';
import { DriverService } from '../../driver/application/driver.service';
import { BusinessService } from '../../business/application/business.service';
import { TUserDto } from '../presentation/user.dto';
import { TAuthDto } from '../presentation/auth.dto';

@Injectable()
export class UserService {
  private readonly userServices: {
    [key: string]: IUserService;
  } = {};

  constructor(
    private readonly customerService: CustomerService,
    private readonly driverService: DriverService,
    private readonly businessService: BusinessService,
  ) {
    this.userServices.customer = customerService;
    this.userServices.driver = driverService;
    this.userServices.business = businessService;
  }

  async findOne(dto: TUserDto): Promise<any> {
    const user = await this.userServices[dto.userType].findOne(dto);

    user && (user.userType = dto.userType);
    return user;
  }

  async create(dto: TUserDto) {
    return this.userServices[dto.userType].create(dto);
  }

  async update(dto: TAuthDto) {
    return await this.userServices[dto.userType].update(dto);
  }

  toUserDto(user: any) {
    return this.userServices[user.userType].toUserDto(user);
  }
}
