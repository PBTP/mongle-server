import {IUUIDHolder} from '../../src/common/holder/uuid.holders';
import {IDateHolder} from '../../src/common/holder/date.holder';

export class FakeUuidHolder implements IUUIDHolder {
  private readonly uuids: string[] = [];

  constructor(
    initUuids = ['test-uuid-3', 'test-uuid-2', 'test-uuid-1'],
  ) {
    this.uuids = initUuids;
  }

  generatedUuid(): string {
    return this.uuids.pop()?.toString() ?? 'test-uuid';
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
