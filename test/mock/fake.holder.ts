import { IUUIDHolder } from '../../src/common/holder/uuid.holders';
import { IDateHolder } from '../../src/common/holder/date.holder';

export class FakeUuidHolder implements IUUIDHolder {
  generatedUuid(): string {
    return 'test-uuid';
  }
}

export class FakeDateHolder implements IDateHolder {
  date: Date;

  constructor(date: Date) {
    this.date = date;
  }

  now(): Date {
    return this.date;
  }
}
