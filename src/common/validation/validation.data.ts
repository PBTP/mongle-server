import { UserGroup } from '../../auth/presentation/user.dto';

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
};
