import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from '../../auth/user.interface';
import { UserDto } from '../../auth/presentation/user.dto';
import { Business } from '../../schemas/business.entity';

@Injectable()
export class BusinessService implements IUserService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async signUp(dto: Business): Promise<Business> {
    const newDriver = this.businessRepository.create(dto);
    return await this.businessRepository.save(newDriver);
  }

  async findOne(dto: Partial<UserDto>): Promise<Business> {
    const where = {};

    dto.userId && (where['driverId'] = dto.userId);
    dto.uuid && (where['uuid'] = dto.uuid);

    return await this.businessRepository.findOne({
      where: where,
    });
  }
}
