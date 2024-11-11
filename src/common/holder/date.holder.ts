import { Injectable } from '@nestjs/common';

export const DATE_HOLDER = Symbol('DATE_HOLDER');
export interface IDateHolder {
  now(): Date;
}

@Injectable()
export class DateHolder implements IDateHolder {
  now(): Date {
    return new Date();
  }
}
