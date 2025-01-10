import { BeforeInsert, Column } from 'typeorm';
import { getTsid } from 'tsid-ts';

export abstract class HasUuid {
  @Column({ type: 'varchar', length: 44, unique: true, nullable: false })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = this.uuid ?? getTsid().toString();
  }
}

export abstract class HasTsid {
  @Column({ type: 'char', length: 13, unique: true, nullable: false })
  tsid: string;

  @BeforeInsert()
  generateTSID() {
    this.tsid = this.tsid ?? getTsid().toString();
  }
}
