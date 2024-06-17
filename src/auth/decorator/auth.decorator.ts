import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { Customer } from '../../schemas/customers.entity';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

export const CurrentCustomer = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: { user?: Customer } = context.switchToHttp().getRequest();
    return req.user;
  },
);

export function Auth(authGuardType: string = 'access') {
  return applyDecorators(
    UseGuards(AuthGuard(authGuardType)),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description:
        'Unauthorized / Access Token이 만료되었거나 잘못되었습니다. 토큰을 갱신하세요',
    }),
  );
}
