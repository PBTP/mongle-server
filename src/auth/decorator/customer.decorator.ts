import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Customer } from '../../schemas/customers.entity';

export const CurrentCustomer = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: { user?: Customer } = context.switchToHttp().getRequest();
    return req.user;
  },
);
