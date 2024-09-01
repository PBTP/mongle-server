import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Business } from '../../schemas/business.entity';
import { Repository } from 'typeorm';
import { AuthProvider } from '../../auth/presentation/user.dto';

describe('BusinessService', () => {
  let service: BusinessService;
  let repo: Repository<Business>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        {
          provide: getRepositoryToken(Business),
          useClass: Repository<Business>,
        },
      ],
    }).compile();

    service = module.get<BusinessService>(BusinessService);
    repo = module.get<Repository<Business>>(getRepositoryToken(Business));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('업체 조회', async () => {
    const business = new Business();
    business.businessId = 1;
    business.businessName = 'test';
    business.uuid = 'test';
    business.authProvider = AuthProvider.BASIC;

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(business);

    expect(await service.findOne({ userId: 1 })).toEqual(business);
  });

  it('업체 계정 생성', async () => {
    const business = new Business();
    business.businessId = 1;
    business.businessName = 'test';
    business.uuid = 'test';
    business.authProvider = AuthProvider.BASIC;

    jest.spyOn(repo, 'create').mockReturnValueOnce(business);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(business);

    expect(
      await service.create({
        uuid: 'test',
        name: 'test',
        userType: 'business',
        phoneNumber: '0101111111',
        authProvider: AuthProvider.BASIC,
      }),
    ).toEqual(business);
  });

  it('업체 정보 수정', async () => {
    const business = new Business();
    business.businessId = 1;
    business.businessName = 'test';
    business.uuid = 'test';
    business.authProvider = AuthProvider.BASIC;

    const updatedBusiness = new Business();
    updatedBusiness.businessId = 1;
    updatedBusiness.businessName = 'updated test';
    updatedBusiness.uuid = 'test';
    updatedBusiness.authProvider = AuthProvider.BASIC;

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(business);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(updatedBusiness);

    expect(
      await service.update({
        userId: 1,
        name: 'updated test',
        phoneNumber: '0101111111',
      }),
    ).toEqual(updatedBusiness);
  });
});
