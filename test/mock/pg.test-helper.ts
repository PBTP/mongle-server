import { DataType, IBackup, IMemoryDb, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { DynamicModule, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class PgTestHelper {
  private readonly logger = new Logger(PgTestHelper.name);
  db: IMemoryDb;
  dataSource: DataSource;
  backup: IBackup;

  async connect(
    entities?: any[],
    synchronize: boolean = false,
  ): Promise<{ db: IMemoryDb; dataSource: any }> {
    this.logger.log('Connecting to the database');
    // pg-mem 설정
    this.db = newDb();
    this.db.public.registerFunction({
      name: 'current_database',
      implementation: () => 'test_database',
    });

    this.dataSource = await this.db.adapters.createTypeormDataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: entities ?? [__dirname + '/../../src/**/*.entity.{ts,js}'],
      synchronize: synchronize,
      namingStrategy: new SnakeNamingStrategy(),
    });

    this.db.registerExtension('postgis', (schema) => {
      schema.registerEquivalentType({
        name: 'geometry',
        equivalentTo: DataType.text,
        isValid: (geo: any) => typeof geo === 'object' && geo.type === 'Point',
      });

      // Register geography type with point and SRID 4326
      schema.registerEquivalentType({
        name: 'geography(Point,4326)',
        equivalentTo: DataType.jsonb,
        isValid: (geo: any) => typeof geo === 'object' && geo.type === 'Point',
      });

      // Register Point type explicitly
      schema.registerEquivalentType({
        name: 'point',
        equivalentTo: DataType.jsonb,
        isValid: (geo: any) => typeof geo === 'object' && geo.type === 'Point',
      });

      schema.registerFunction({
        name: 'ST_AsGeoJSON',
        implementation: (geo: any) => geo,
      });
    });

    this.db.public.registerFunction({
      name: 'version',
      implementation: () => '13.3',
    });

    this.db.public.registerFunction({
      name: 'ST_AsGeoJSON',
      implementation: (geo: any) => geo,
    });

    this.db.public.none(`
      CREATE TYPE auth_provider AS ENUM ('KAKAO', 'APPLE', 'GOOGLE', 'BASIC');
CREATE TYPE geometry AS ENUM ('POINT', 'LINESTRING', 'POLYGON', 'MULTIPOINT', 'MULTILINESTRING', 'MULTIPOLYGON', 'GEOMETRYCOLLECTION');

CREATE TYPE gender AS ENUM ('MALE', 'FEMALE');


CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO');


CREATE TYPE appointment_status AS ENUM ('CONFIRMED', 'COMPLETED', 'CANCELLED');


CREATE TYPE checklist_type AS ENUM ('choice', 'answer');


CREATE TYPE pet_checklist_category AS ENUM ('health', 'food', 'grooming', 'personality', 'other');


CREATE TABLE IF NOT EXISTS spatial_ref_sys
(
  srid      INTEGER NOT NULL
    PRIMARY KEY
    CONSTRAINT spatial_ref_sys_srid_check
      CHECK ((srid > 0) AND (srid <= 998999)),
  auth_name VARCHAR(256),
  auth_srid INTEGER,
  srtext    VARCHAR(2048),
  proj4text VARCHAR(2048)
);

CREATE TABLE IF NOT EXISTS images
(
  image_id   SERIAL
    PRIMARY KEY,
  uuid       VARCHAR(44)             NOT NULL,
  image_url  TEXT                    NOT NULL
    CONSTRAINT images_image_link_unique
      UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);


CREATE TABLE IF NOT EXISTS customers
(
  customer_id             SERIAL
    PRIMARY KEY,
  uuid                    VARCHAR(44)             NOT NULL
    UNIQUE,
  customer_name           VARCHAR(30)             NOT NULL,
  customer_phone_number   TEXT,
  customer_location       geometry,
  auth_provider           auth_provider           NOT NULL,
  created_at              TIMESTAMP DEFAULT NOW() NOT NULL,
  modified_at             TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at              TIMESTAMP,
  refresh_token           TEXT,
  customer_detail_address TEXT,
  customer_address        TEXT
);

COMMENT ON TABLE customers IS '고객';

COMMENT ON COLUMN customers.customer_id IS '고객ID';

COMMENT ON COLUMN customers.uuid IS '식별자 / 외부 서비스에서 사용';

COMMENT ON COLUMN customers.customer_name IS '고객이름';

COMMENT ON COLUMN customers.customer_phone_number IS '고객 연락처';

COMMENT ON COLUMN customers.customer_location IS '고객위치';

COMMENT ON COLUMN customers.auth_provider IS '인증 제공자 (OAuth)';

COMMENT ON COLUMN customers.created_at IS '생성일시';

COMMENT ON COLUMN customers.modified_at IS '수정일시';

COMMENT ON COLUMN customers.deleted_at IS '삭제일시';

COMMENT ON COLUMN customers.refresh_token IS 'JWT 리프레시 토큰';

COMMENT ON COLUMN customers.customer_detail_address IS '고객 상세 주소';

COMMENT ON COLUMN customers.customer_address IS '고객 주소';


CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_refresh_token
  ON customers (refresh_token);

    `);

    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
      this.logger.log('Initialized the database');
    }

    this.backup = this.db.backup();

    this.logger.log('Connected to the database');

    return { db: this.db, dataSource: this.dataSource };
  }

  async query(query: string) {
    const client = this.db.adapters.createPgPromise();

    await client.query(query);
  }

  restore() {
    this.logger.log('Restoring the database');
    this.backup.restore();
    this.logger.log('Restored the database');
  }

  async disconnect() {
    if (this.dataSource.isInitialized) {
      this.logger.log('Disconnecting from the database');
      await this.dataSource.destroy();
      this.logger.log('Disconnected from the database');
    }
  }

  async sync() {
    this.logger.log('Synchronizing the database');
    await this.dataSource.synchronize();
    this.logger.log('Synchronized the database');
  }

  async module(): Promise<DynamicModule> {
    return TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'postgres',
          logging: true,
        };
      },
    });
  }
}
