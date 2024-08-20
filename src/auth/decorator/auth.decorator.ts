import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Customer } from '../../schemas/customers.entity';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Business } from '../../schemas/business.entity';
import { Driver } from '../../schemas/drivers.entity';

export const CurrentCustomer = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: { user?: Customer } = context.switchToHttp().getRequest();
    return req.user;
  },
);

export const CurrentBusiness = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: { user?: Business } = context.switchToHttp().getRequest();
    return req.user;
  },
);

export const CurrentDriver = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: { user?: Driver } = context.switchToHttp().getRequest();
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
