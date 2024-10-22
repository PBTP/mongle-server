import { DateHolder, UUIDHolder } from '../../src/schemas/customer.entity';
import { getTsid } from 'tsid-ts';

export class FakeUuidHolder implements UUIDHolder {
  generatedUuid(): string {
    return getTsid().toString();
  }
}

export class FakeDateHolder implements DateHolder {
  now(): Date {
    return new Date();
  }

}
