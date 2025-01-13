import { IBackup, IMemoryDb, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

export class PgTestHelper {
  db: IMemoryDb;
  dataSource: DataSource;
  backup: IBackup;

  async connect(
    entities?: [any],
    synchronize: boolean = false,
  ): Promise<{ db: IMemoryDb; dataSource: any }> {
    // pg-mem 설정
    this.db = newDb();
    this.db.public.registerFunction({
      name: 'current_database',
      implementation: () => 'test_database',
    });

    this.db.public.registerFunction({
      name: 'version',
      implementation: () => '13.3',
    });
    const dataSource = await this.db.adapters.createTypeormDataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: entities ?? [__dirname + '/../../src/**/*.entity.{ts,js}'],
      synchronize: synchronize,
    });

    this.backup = this.db.backup();

    return { db: this.db, dataSource: dataSource };
  }

  restore() {
    this.backup.restore();
  }

  async disconnect() {
    await this.dataSource.destroy();
  }

  async sync() {
    await this.dataSource.synchronize();
  }

  async module(): Promise<DynamicModule> {
    return TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'postgres',
        };
      },
    });
  }
}
