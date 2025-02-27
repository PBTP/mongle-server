import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CustomerEntity } from '../../schemas/customer.entity';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeaders,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BusinessEntity } from '../../schemas/business.entity';
import { DriverEntity } from '../../schemas/drivers.entity';
import { UserDto } from '../presentation/user.dto';
import { ApiKeyGuard } from '../../common/guard/api-key.guard';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: { user?: UserDto } = context.switchToHttp().getRequest();

    return req.user;
  },
);

export const CurrentCustomer = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: { user?: CustomerEntity } = context.switchToHttp().getRequest();

    if (!req.user?.customerId) {
      throw new ForbiddenException('해당 계정은 고객 계정이 아닙니다.');
    }
    return CustomerEntity.toModel(req.user);
  },
);

export const CurrentBusiness = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: { user?: BusinessEntity } = context.switchToHttp().getRequest();

    if (!req.user?.businessId) {
      throw new ForbiddenException('해당 계정은 업체 계정이 아닙니다.');
    }
    return req.user;
  },
);

export const CurrentDriver = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: { user?: DriverEntity } = context.switchToHttp().getRequest();

    if (!req.user?.driverId) {
      throw new ForbiddenException('해당 계정은 기사 계정이 아닙니다.');
    }
    return req.user;
  },
);

export function Auth(
  httpStatusCode: HttpStatus | number = HttpStatus.OK,
  authGuardType: string = 'access',
) {
  return applyDecorators(
    UseGuards(AuthGuard(authGuardType)),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description:
        'Unauthorized / Access Token이 만료되었거나 잘못되었습니다. 토큰을 갱신하세요',
    }),
    HttpCode(httpStatusCode),
  );
}

export function ApiKey(httpStatusCode: HttpStatus | number = HttpStatus.OK) {
  return applyDecorators(
    UseGuards(ApiKeyGuard),
    ApiHeaders([
      {
        name: 'X-API-KEY',
        description:
          'API Key를 넣으시면 됩니다 api key는 파라미터 스토어 security/api/key에 존재합니다.',
        required: true,
      },
    ]),
    ApiForbiddenResponse({
      description: 'Unauthorized / API Key가 잘못되었습니다.',
    }),
    HttpCode(httpStatusCode),
  );
}
