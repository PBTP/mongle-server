import { UserGroup } from "@auth/presentation/user.dto";
import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common/exceptions';

export enum CrudGroup {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

export type Group = CrudGroup | UserGroup;

export const RUD = [CrudGroup.read, CrudGroup.update, CrudGroup.delete];
export const CRUD = [
  CrudGroup.create,
  CrudGroup.read,
  CrudGroup.update,
  CrudGroup.delete,
];

export const ValidationDefaultOption = {
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  groups: undefined,
  exceptionFactory: (errors: ValidationError[]) => {
    const errorMessages = errors.map(
      (error) =>
        `${error.property} has wrong value ${error.value}, ${Object.values(error.constraints as { string: string }).join(', ')}`,
    );
    return new BadRequestException(errorMessages.join(', '));
  },
};
