import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Business } from './business.entity';

@Entity()
export class Business_notices {
  @PrimaryColumn()
  @ApiProperty({
    example: 'business_notice_id 예시',
    description: 'business_notice_id 설명',
  })
  public business_notice_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column()
  @ApiProperty({ example: 'title 예시', description: 'title 설명' })
  public title: string;

  @Column()
  @ApiProperty({ example: 'content 예시', description: 'content 설명' })
  public content: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: 'modified_at 예시', description: 'modified_at 설명' })
  public modified_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ example: 'deleted_at 예시', description: 'deleted_at 설명' })
  public deleted_at: Date;

  @ManyToOne(() => Business, (business) => business.business_notices)
  @JoinColumn({ name: 'business_id' })
  public business: Business;
}
