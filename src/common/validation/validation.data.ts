export enum Group {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

export const RUD = [Group.read, Group.update, Group.delete];

export const ValidationDefaultOption = {
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  groups: undefined,
};
