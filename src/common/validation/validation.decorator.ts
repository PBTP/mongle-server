import { applyDecorators, UsePipes, ValidationPipe } from '@nestjs/common';
import { Group, ValidationDefaultOption } from './validation.data';

// Socket은 ValidationPipe와 Filter가 글로벌 적용되지 않기 때문에  Subscribe 데코레이터를 만들어서 사용한다.

export function GroupValidation(groups?: Group[]) {
  const option = { ...ValidationDefaultOption };
  option.groups = groups;
  return applyDecorators(UsePipes(new ValidationPipe(option)));
}
