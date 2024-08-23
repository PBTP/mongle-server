import { Test, TestingModule } from '@nestjs/testing';
import { BusinessController } from './business.controller';
import { BusinessService } from '../application/business.service';
import { Business } from '../../schemas/business.entity';
import { AuthProvider } from '../../auth/presentation/user.dto';
import { CurrentBusiness } from '../../auth/decorator/auth.decorator';
import { ForbiddenException } from '@nestjs/common';

describe('BusinessController', () => {
  let controller: BusinessController;
  let businessService: BusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        {
          provide: BusinessService,
          useValue: {
            // 필요한 서비스 메서드를 모킹
          },
        },
      ],
    }).compile();

    controller = module.get<BusinessController>(BusinessController);
    businessService = module.get<BusinessService>(BusinessService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('내 업체 정보 조회', () => {
    it('인증되면 비즈니스 정보를 반환', async () => {
      const mockBusiness = new Business();
      mockBusiness.businessId = 1;
      mockBusiness.businessName = 'Test Business';
      mockBusiness.uuid = 'test-uuid';
      mockBusiness.authProvider = AuthProvider.BASIC;
      mockBusiness.openingDate = new Date();
      mockBusiness.businessRule = 'Rule';

      jest.spyOn(businessService, 'findOne').mockResolvedValue(mockBusiness);

      const result = await controller.getMyBusinessInfo(mockBusiness);

      expect(result).toEqual({
        uuid: 'test-uuid',
        authProvider: 'local',
        openingDate: mockBusiness.openingDate,
        businessId: 1,
        businessName: 'Test Business',
        businessRule: 'Rule',
      });
    });

    it('사용자가 비즈니스가 아닌 경우 금지된 예외를 던져야 함\n', () => {
      const mockBusiness = new Business();
      mockBusiness.businessId = 1;
      mockBusiness.businessName = 'Test Business';
      mockBusiness.uuid = 'test-uuid';
      mockBusiness.authProvider = AuthProvider.BASIC;
      mockBusiness.openingDate = new Date();
      mockBusiness.businessRule = 'Rule';

      expect(() =>
        CurrentBusiness(null, {
          switchToHttp: () => ({
            getRequest: () => ({ user: mockBusiness }),
          }),
        } as any),
      ).toThrow(ForbiddenException);
    });
  });
});
