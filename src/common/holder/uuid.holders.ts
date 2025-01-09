import {getTsid} from 'tsid-ts';
import {Injectable} from '@nestjs/common';

export const UUID_HOLDER = Symbol('UUID_HOLDER');
export interface IUUIDHolder {
  generatedUuid(): string;
}

@Injectable()
export class UUIDHolder implements IUUIDHolder {
  generatedUuid(): string {
    return getTsid().toString();
  }
}
