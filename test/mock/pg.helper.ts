import { IBackup, IMemoryDb, newDb } from 'pg-mem';
import { Connection } from 'typeorm';

export class PgTestHelper {
  db: IMemoryDb;
  connection: Connection;
  backup: IBackup;

  async connect(entities?: any[]) {
    this.db = newDb({ autoCreateForeignKeyIndices: true });
    this.db.public.registerFunction({
      implementation: () => 'test',
      name: 'current_database',
    });
    this.db.public.registerFunction({
      implementation: () => 'test',
      name: 'version',
    });
    this.connection = await this.db.adapters.createTypeormDataSource({
      type: 'postgres',
      username: 'test',
      password: 'test',
      entities: entities ?? __dirname + '/../../src/**/*.entity.{ts,js}',
      logger: 'advanced-console',
      logging: true,
      synchronize: true,
    });
    await this.sync();
    this.backup = this.db.backup();
    return this.connection;
  }

  restore() {
    this.backup.restore();
  }

  async disconnect() {
    await this.connection.close();
  }

  async sync() {
    await this.connection.synchronize();
  }
}
